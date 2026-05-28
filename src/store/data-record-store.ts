import { BaseStore } from './base-store';
import { type DataRecord } from '@app-types/models';
import { generateId } from '@utils/id-generator';

const STORAGE_KEY = 'dataRecords';

export class DataRecordStore extends BaseStore<DataRecord[]> {
  constructor() {
    super([]);
  }

  async load(): Promise<void> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = (result[STORAGE_KEY] ?? []) as DataRecord[];
    // Migrate legacy Record<string,string> values to DataFieldValue[]
    const migrated = raw.map((r) => ({
      ...r,
      values: Array.isArray(r.values)
        ? r.values
        : Object.entries(r.values as unknown as Record<string, string>).map(([name, value]) => ({ name, selector: '', value })),
    }));
    this.replaceState(migrated);
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

  async importFrom(records: DataRecord[]): Promise<number> {
    const existing = new Set(this._state.map((r) => r.id));
    const incoming = records.filter((r) => !existing.has(r.id));
    if (incoming.length > 0) {
      this.replaceState([...incoming, ...this._state]);
      await this.persist();
    }
    return incoming.length;
  }

}

export const dataRecordStore = new DataRecordStore();
