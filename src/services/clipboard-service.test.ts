import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { saveSnapshot, getSnapshot, clearSnapshot } from './clipboard-service';
import type { CookieSnapshot } from '../types/models';

const fakeSnapshot: CookieSnapshot = {
  sourceDomain: 'example.com',
  sourceUrl: 'https://example.com/page',
  cookies: [{ name: 'sid', value: 'abc' } as chrome.cookies.Cookie],
  localStorage: { key: 'value' },
  sessionStorage: {},
  timestamp: Date.now(),
};

describe('clipboard-service', () => {
  beforeEach(() => {
    storageMock.set.mockClear();
    storageMock.get.mockClear();
    storageMock.remove.mockClear();
  });

  describe('saveSnapshot / getSnapshot', () => {
    it('saves and retrieves a snapshot', async () => {
      await saveSnapshot(fakeSnapshot);

      storageMock.get.mockResolvedValueOnce({ cookieSnapshot: fakeSnapshot });
      const snap = await getSnapshot();
      expect(snap?.sourceDomain).toBe('example.com');
      expect(snap?.cookies).toHaveLength(1);
    });
  });

  describe('getSnapshot', () => {
    it('returns null when no snapshot exists', async () => {
      storageMock.get.mockResolvedValueOnce({});
      const snap = await getSnapshot();
      expect(snap).toBeNull();
    });
  });

  describe('clearSnapshot', () => {
    it('removes the snapshot', async () => {
      await clearSnapshot();
      expect(storageMock.remove).toHaveBeenCalledWith('cookieSnapshot');
    });
  });
});
