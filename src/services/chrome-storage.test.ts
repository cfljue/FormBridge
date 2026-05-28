import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { getLocal, setLocal, removeLocal, onStorageChanged } from './chrome-storage';

describe('chrome-storage service', () => {
  beforeEach(() => {
    storageMock.get.mockClear();
    storageMock.set.mockClear();
    storageMock.remove.mockClear();
  });

  describe('getLocal', () => {
    it('gets a single key', async () => {
      storageMock.get.mockResolvedValueOnce({ myKey: 'myValue' });
      const result = await getLocal('myKey');
      expect(result).toEqual({ myKey: 'myValue' });
      expect(storageMock.get).toHaveBeenCalledWith('myKey');
    });

    it('gets multiple keys', async () => {
      storageMock.get.mockResolvedValueOnce({ a: 1, b: 2 });
      const result = await getLocal(['a', 'b']);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('setLocal', () => {
    it('sets items in storage', async () => {
      await setLocal({ key: 'value' });
      expect(storageMock.set).toHaveBeenCalledWith({ key: 'value' });
    });
  });

  describe('removeLocal', () => {
    it('removes keys from storage', async () => {
      await removeLocal(['key1', 'key2']);
      expect(storageMock.remove).toHaveBeenCalledWith(['key1', 'key2']);
    });
  });

  describe('onStorageChanged', () => {
    it('registers and returns unsubscribe function', () => {
      const handler = () => {};
      const unsub = onStorageChanged(handler);
      expect(storageMock.onChanged.addListener).toHaveBeenCalledWith(handler);

      unsub();
      expect(storageMock.onChanged.removeListener).toHaveBeenCalledWith(handler);
    });
  });
});
