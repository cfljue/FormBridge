import { BaseStore } from './base-store';
import { type DataFieldValue, type DataRecord } from '@app-types/models';
import { generateId } from '@utils/id-generator';
import { sanitizeInputType } from '@utils/field-input-type';

const STORAGE_KEY = 'dataRecords';

function normalizeValues(raw: unknown): DataFieldValue[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((value): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value))
      .map((value) => ({
        name: typeof value.name === 'string' ? value.name : '',
        selector: typeof value.selector === 'string' ? value.selector : '',
        value: typeof value.value === 'string' ? value.value : '',
        ...sanitizeInputType(value.inputType),
      }))
      .filter((value) => value.name.trim() !== '' || value.selector.trim() !== '');
  }

  if (raw && typeof raw === 'object') {
    // Legacy shape: Record<string, string>
    return Object.entries(raw as Record<string, unknown>)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([name, value]) => ({ name, selector: '', value }));
  }

  return [];
}

/**
 * Coerces a stored or imported value into a usable record, dropping unusable entries instead of
 * throwing: one malformed record used to abort the whole load and leave the list empty.
 */
export function normalizeDataRecord(raw: unknown, index = 0): DataRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const source = raw as Partial<DataRecord>;
  const name = typeof source.name === 'string' ? source.name : '';
  if (!name.trim()) return null;

  const now = Date.now();
  return {
    id: typeof source.id === 'string' && source.id ? source.id : generateId(),
    name,
    description: typeof source.description === 'string' ? source.description : '',
    url: typeof source.url === 'string' ? source.url : '',
    templateId: typeof source.templateId === 'string' ? source.templateId : '',
    values: normalizeValues(source.values),
    buttonName: typeof source.buttonName === 'string' ? source.buttonName : undefined,
    buttonSelector: typeof source.buttonSelector === 'string' ? source.buttonSelector : undefined,
    order: typeof source.order === 'number' && Number.isFinite(source.order) ? source.order : index,
    createdAt: typeof source.createdAt === 'number' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'number' ? source.updatedAt : now,
  };
}

export class DataRecordStore extends BaseStore<DataRecord[]> {
  constructor() {
    super([]);
  }

  async load(): Promise<void> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = result[STORAGE_KEY];
    const records = Array.isArray(raw)
      ? raw.map((entry, index) => normalizeDataRecord(entry, index)).filter((record): record is DataRecord => record !== null)
      : [];

    if (Array.isArray(raw) && records.length < raw.length) {
      console.warn(`[FormBridge] Ignored ${raw.length - records.length} malformed data record(s).`);
    }

    this.replaceState(records);
  }

  async persist(): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: this._state });
  }

  async add(data: Omit<DataRecord, 'id' | 'order' | 'createdAt' | 'updatedAt'>): Promise<DataRecord> {
    const now = Date.now();
    const record: DataRecord = {
      ...data,
      values: [...data.values],
      id: generateId(),
      order: this._state.length,
      createdAt: now,
      updatedAt: now,
    };
    this.replaceState([record, ...this._state]);
    await this.persist();
    return record;
  }

  async update(id: string, data: Partial<Omit<DataRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    this.replaceState(
      this._state.map((r) =>
        r.id === id ? { ...r, ...data, values: data.values ? [...data.values] : r.values, updatedAt: Date.now() } : r
      )
    );
    await this.persist();
  }

  async delete(id: string): Promise<void> {
    this.replaceState(this._state.filter((r) => r.id !== id));
    await this.persist();
  }

  async deleteMany(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    this.replaceState(this._state.filter((r) => !idSet.has(r.id)));
    await this.persist();
  }

  getById(id: string): DataRecord | undefined {
    return this._state.find((r) => r.id === id);
  }

  async reorder(fromIndex: number, toIndex: number): Promise<void> {
    const records = [...this._state];
    const [moved] = records.splice(fromIndex, 1);
    records.splice(toIndex, 0, moved);
    this.replaceState(records.map((r, i) => ({ ...r, order: i })));
    await this.persist();
  }

  /**
   * Adds imported records, assigning missing ids and timestamps. Duplicate ids are skipped.
   * Input is untrusted: malformed entries are dropped rather than written to storage.
   */
  async importFrom(items: unknown[]): Promise<number> {
    const existing = new Set(this._state.map((r) => r.id));
    const incoming: DataRecord[] = [];

    for (const item of items) {
      const record = normalizeDataRecord(item, this._state.length + incoming.length);
      if (!record || existing.has(record.id)) continue;
      existing.add(record.id);
      incoming.push(record);
    }

    if (incoming.length > 0) {
      this.replaceState([...incoming, ...this._state]);
      await this.persist();
    }
    return incoming.length;
  }

}

export const dataRecordStore = new DataRecordStore();
