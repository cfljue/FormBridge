import { BaseStore } from './base-store';
import { type Template, type TemplateField, type TemplateFieldInput } from '@app-types/models';
import { generateId } from '@utils/id-generator';
import { sanitizeInputType } from '@utils/field-input-type';

const STORAGE_KEY = 'templates';

/** Input accepted by add/update: field ids are optional and filled in by the store. */
export type TemplateStoreInput = Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'fields'> & {
  fields: TemplateFieldInput[];
};

function normalizeFields(raw: unknown): TemplateField[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((value): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value))
    .map((value) => ({
      id: typeof value.id === 'string' && value.id ? value.id : generateId(),
      name: typeof value.name === 'string' ? value.name : '',
      selector: typeof value.selector === 'string' ? value.selector : '',
      ...sanitizeInputType(value.inputType),
    }))
    .filter((field) => field.name.trim() !== '' || field.selector.trim() !== '');
}

/**
 * Coerces a stored or imported value into a usable template, dropping unusable entries instead
 * of throwing so one malformed entry cannot empty the whole list.
 */
export function normalizeTemplate(raw: unknown, index = 0): Template | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const source = raw as Partial<Template>;
  const name = typeof source.name === 'string' ? source.name : '';
  if (!name.trim()) return null;

  const now = Date.now();
  const button = source.button;
  const hasButton = !!button && typeof button === 'object' && typeof button.selector === 'string' && button.selector !== '';

  return {
    id: typeof source.id === 'string' && source.id ? source.id : generateId(),
    name,
    description: typeof source.description === 'string' ? source.description : '',
    url: typeof source.url === 'string' ? source.url : '',
    fields: normalizeFields(source.fields),
    button: hasButton ? { name: typeof button.name === 'string' ? button.name : 'Submit', selector: button.selector as string } : undefined,
    createdAt: typeof source.createdAt === 'number' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'number' ? source.updatedAt : now,
  };
}

export class TemplateStore extends BaseStore<Template[]> {
  constructor() {
    super([]);
  }

  async load(): Promise<void> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = result[STORAGE_KEY];
    const templates = Array.isArray(raw)
      ? raw.map((entry, index) => normalizeTemplate(entry, index)).filter((template): template is Template => template !== null)
      : [];

    if (Array.isArray(raw) && templates.length < raw.length) {
      console.warn(`[FormBridge] Ignored ${raw.length - templates.length} malformed template(s).`);
    }

    this.replaceState(templates);
  }

  async persist(): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: this._state });
  }

  private _newTemplate(
    name: string,
    description: string,
    url: string,
    fields: TemplateFieldInput[],
    button?: Template['button']
  ): Template {
    const now = Date.now();
    return {
      id: generateId(),
      name,
      description,
      url,
      fields: fields.map((f) => ({ ...f, id: f.id || generateId() })),
      button: button && button.selector ? { ...button } : undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  async add(data: TemplateStoreInput): Promise<Template> {
    const template = this._newTemplate(data.name, data.description, data.url, data.fields, data.button);
    this.replaceState([template, ...this._state]);
    await this.persist();
    return template;
  }

  async update(id: string, data: Partial<TemplateStoreInput>): Promise<void> {
    this.replaceState(
      this._state.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              fields: data.fields ? data.fields.map((f) => ({ ...f, id: f.id || generateId() })) : t.fields,
              button: data.button !== undefined ? (data.button && data.button.selector ? { ...data.button } : undefined) : t.button,
              updatedAt: Date.now(),
            }
          : t
      )
    );
    await this.persist();
  }

  async delete(id: string): Promise<void> {
    this.replaceState(this._state.filter((t) => t.id !== id));
    await this.persist();
  }

  async deleteMany(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    this.replaceState(this._state.filter((t) => !idSet.has(t.id)));
    await this.persist();
  }

  getById(id: string): Template | undefined {
    return this._state.find((t) => t.id === id);
  }

  /**
   * Adds imported templates, assigning missing ids and timestamps. Duplicate ids are skipped.
   * Input is untrusted: malformed entries are dropped rather than written to storage.
   */
  async importFrom(items: unknown[]): Promise<number> {
    const existing = new Set(this._state.map((t) => t.id));
    const incoming: Template[] = [];

    for (const item of items) {
      const template = normalizeTemplate(item);
      if (!template || existing.has(template.id)) continue;
      existing.add(template.id);
      incoming.push(template);
    }

    if (incoming.length > 0) {
      this.replaceState([...incoming, ...this._state]);
      await this.persist();
    }
    return incoming.length;
  }
}

export const templateStore = new TemplateStore();
