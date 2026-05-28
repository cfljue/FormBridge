import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { templateStore } from './template-store';

describe('TemplateStore', () => {
  beforeEach(async () => {
    storageMock.set.mockClear();
    storageMock.get.mockClear();
    // Reload: mock returns empty templates
    storageMock.get.mockResolvedValue({});
    await templateStore.load();
  });

  describe('add', () => {
    it('creates a template and prepends to state', async () => {
      const t = await templateStore.add({
        name: 'Test', description: 'Desc', url: 'example.com',
        fields: [{ name: 'email', selector: '#email' }],
      });
      expect(t.id).toBeTruthy();
      expect(t.name).toBe('Test');
      expect(t.order).toBeUndefined(); // templates have no order
      expect(t.createdAt).toBeGreaterThan(0);
      expect(templateStore.state.length).toBe(1);
      expect(templateStore.state[0].id).toBe(t.id);
      expect(storageMock.set).toHaveBeenCalled();
    });

    it('ensures fields have ids', async () => {
      const t = await templateStore.add({
        name: 'T', description: '', url: '',
        fields: [{ name: 'f1', selector: '#f1' }],
      });
      expect(t.fields[0].id).toBeTruthy();
    });
  });

  describe('update', () => {
    it('updates an existing template', async () => {
      const t = await templateStore.add({
        name: 'Original', description: '', url: '',
        fields: [],
      });
      await templateStore.update(t.id, { name: 'Updated' });
      const updated = templateStore.getById(t.id);
      expect(updated?.name).toBe('Updated');
      expect(updated?.updatedAt).toBeGreaterThanOrEqual(t.updatedAt);
      expect(storageMock.set).toHaveBeenCalledTimes(2); // add + update
    });

    it('does nothing when id not found', async () => {
      await expect(templateStore.update('nonexistent', { name: 'X' })).resolves.not.toThrow();
    });
  });

  describe('delete', () => {
    it('removes template by id', async () => {
      const t = await templateStore.add({
        name: 'ToDelete', description: '', url: '', fields: [],
      });
      await templateStore.delete(t.id);
      expect(templateStore.getById(t.id)).toBeUndefined();
      expect(templateStore.state.length).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('removes multiple templates', async () => {
      const t1 = await templateStore.add({ name: 'A', description: '', url: '', fields: [] });
      const t2 = await templateStore.add({ name: 'B', description: '', url: '', fields: [] });
      await templateStore.deleteMany([t1.id, t2.id]);
      expect(templateStore.state.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('returns template or undefined', async () => {
      const t = await templateStore.add({ name: 'X', description: '', url: '', fields: [] });
      expect(templateStore.getById(t.id)).toBeTruthy();
      expect(templateStore.getById('no-such-id')).toBeUndefined();
    });
  });

  describe('importFrom', () => {
    it('deduplicates by id and prepends new ones', async () => {
      const existing = await templateStore.add({ name: 'Existing', description: '', url: '', fields: [] });
      const count = await templateStore.importFrom([
        { ...existing, name: 'Should not import' },
        {
          id: 'new-id', name: 'New', description: '', url: '', templateId: '',
          fields: [], createdAt: 0, updatedAt: 0,
        } as any,
      ]);
      expect(count).toBe(1);
      expect(templateStore.state.length).toBe(2); // existing + new
      expect(templateStore.state[0].id).toBe('new-id'); // prepended
    });
  });
});
