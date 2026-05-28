import { BaseStore } from './base-store';
import { type Template } from '@app-types/models';
import { generateId } from '@utils/id-generator';

const STORAGE_KEY = 'templates';

export class TemplateStore extends BaseStore<Template[]> {
  constructor() {
    super([]);
  }

  async load(): Promise<void> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    this.replaceState((result[STORAGE_KEY] ?? []) as Template[]);
  }

  async persist(): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: this._state });
  }

  private _newTemplate(
    name: string,
    description: string,
    url: string,
    fields: Template['fields'],
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

  async add(data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const template = this._newTemplate(data.name, data.description, data.url, data.fields, data.button);
    this.replaceState([template, ...this._state]);
    await this.persist();
    return template;
  }

  async update(id: string, data: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
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

  async importFrom(templates: Template[]): Promise<number> {
    const existing = new Set(this._state.map((t) => t.id));
    const incoming = templates.filter((t) => !existing.has(t.id));
    if (incoming.length > 0) {
      this.replaceState([...incoming, ...this._state]);
      await this.persist();
    }
    return incoming.length;
  }
}

export const templateStore = new TemplateStore();
