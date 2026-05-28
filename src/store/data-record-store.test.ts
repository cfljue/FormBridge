import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';
import type { DataRecord } from '../types/models';

const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { dataRecordStore } from './data-record-store';

describe('DataRecordStore', () => {
  beforeEach(async () => {
    storageMock.set.mockClear();
    storageMock.get.mockClear();
    storageMock.get.mockResolvedValue({});
    await dataRecordStore.load();
  });

  describe('add', () => {
    it('creates a record and prepends to state', async () => {
      const r = await dataRecordStore.add({
        name: 'Record', description: '', url: 'example.com',
        templateId: 't1',
        values: [{ name: 'email', selector: '#email', value: 'test@test.com' }],
      });
      expect(r.id).toBeTruthy();
      expect(r.name).toBe('Record');
      expect(r.order).toBe(0);
      expect(r.createdAt).toBeGreaterThan(0);
      expect(dataRecordStore.state.length).toBe(1);
      expect(storageMock.set).toHaveBeenCalled();
    });

    it('copies values array (not reference)', async () => {
      const values = [{ name: 'f', selector: '#f', value: 'v' }];
      const r = await dataRecordStore.add({
        name: 'R', description: '', url: '', templateId: '', values,
      });
      values.push({ name: 'f2', selector: '#f2', value: 'v2' });
      expect(r.values.length).toBe(1); // original not mutated
    });
  });

  describe('update', () => {
    it('updates existing record', async () => {
      const r = await dataRecordStore.add({
        name: 'Old', description: '', url: '', templateId: '',
        values: [],
      });
      await dataRecordStore.update(r.id, { name: 'New' });
      expect(dataRecordStore.getById(r.id)?.name).toBe('New');
    });
  });

  describe('delete', () => {
    it('removes record by id', async () => {
      const r = await dataRecordStore.add({
        name: 'Del', description: '', url: '', templateId: '', values: [],
      });
      await dataRecordStore.delete(r.id);
      expect(dataRecordStore.getById(r.id)).toBeUndefined();
    });
  });

  describe('deleteMany', () => {
    it('removes multiple records', async () => {
      const r1 = await dataRecordStore.add({ name: 'A', description: '', url: '', templateId: '', values: [] });
      const r2 = await dataRecordStore.add({ name: 'B', description: '', url: '', templateId: '', values: [] });
      await dataRecordStore.deleteMany([r1.id, r2.id]);
      expect(dataRecordStore.state.length).toBe(0);
    });
  });

  describe('reorder', () => {
    it('moves item from one index to another', async () => {
      await dataRecordStore.add({ name: 'A', description: '', url: '', templateId: '', values: [] });
      await dataRecordStore.add({ name: 'B', description: '', url: '', templateId: '', values: [] });
      await dataRecordStore.add({ name: 'C', description: '', url: '', templateId: '', values: [] });

      await dataRecordStore.reorder(0, 2);

      const names = dataRecordStore.state.map(r => r.name);
      expect(names).toEqual(['B', 'A', 'C']);
    });

    it('reassigns order values', async () => {
      await dataRecordStore.add({ name: 'A', description: '', url: '', templateId: '', values: [] });
      await dataRecordStore.add({ name: 'B', description: '', url: '', templateId: '', values: [] });

      await dataRecordStore.reorder(0, 1);

      const orders = dataRecordStore.state.map(r => r.order);
      expect(orders).toEqual([0, 1]);
    });
  });

  describe('load with legacy migration', () => {
    it('migrates old Record<string,string> values to DataFieldValue[]', async () => {
      const legacyRecord = {
        id: 'legacy-1',
        name: 'Legacy',
        description: '',
        url: 'example.com',
        templateId: 't1',
        values: { fieldName: 'hello' },
        order: 0,
        createdAt: 1000,
        updatedAt: 1000,
      };

      storageMock.get.mockResolvedValueOnce({
        dataRecords: [legacyRecord],
      });

      await dataRecordStore.load();

      const loaded = dataRecordStore.getById('legacy-1');
      expect(Array.isArray(loaded?.values)).toBe(true);
      expect(loaded?.values).toEqual([
        { name: 'fieldName', selector: '', value: 'hello' },
      ]);
    });

    it('keeps already-migrated DataFieldValue[] as-is', async () => {
      const modernRecord = {
        id: 'modern-1',
        name: 'Modern',
        description: '',
        url: 'example.com',
        templateId: 't1',
        values: [{ name: 'f1', selector: '#f1', value: 'v1' }],
        order: 0,
        createdAt: 2000,
        updatedAt: 2000,
      };

      storageMock.get.mockResolvedValueOnce({
        dataRecords: [modernRecord],
      });

      await dataRecordStore.load();
      const loaded = dataRecordStore.getById('modern-1');
      expect(loaded?.values).toEqual([{ name: 'f1', selector: '#f1', value: 'v1' }]);
    });
  });

  describe('importFrom', () => {
    it('deduplicates and prepends', async () => {
      const existing = await dataRecordStore.add({
        name: 'Existing', description: '', url: '', templateId: '', values: [],
      });
      const count = await dataRecordStore.importFrom([
        { ...existing, name: 'Should skip' } as DataRecord,
        {
          id: 'new-id', name: 'Imported', description: '', url: '', templateId: '',
          values: [], order: 0, createdAt: 0, updatedAt: 0,
        },
      ]);
      expect(count).toBe(1);
      expect(dataRecordStore.state[0].name).toBe('Imported');
    });
  });
});
