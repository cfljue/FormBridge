import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { saveSnapshot, getSnapshot, clearSnapshot, isSnapshotExpired, SNAPSHOT_TTL_MS } from './clipboard-service';
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

  describe('expiry', () => {
    it('treats a snapshot older than the TTL as expired', () => {
      const now = 1_000_000_000;
      expect(isSnapshotExpired({ timestamp: now - SNAPSHOT_TTL_MS + 1 }, now)).toBe(false);
      expect(isSnapshotExpired({ timestamp: now - SNAPSHOT_TTL_MS - 1 }, now)).toBe(true);
    });

    it('treats a timestamp that is missing or not a number as expired', () => {
      expect(isSnapshotExpired({} as Pick<CookieSnapshot, 'timestamp'>)).toBe(true);
      expect(isSnapshotExpired({ timestamp: Number.NaN })).toBe(true);
    });

    it('drops an expired snapshot on read and deletes it from storage', async () => {
      const expired: CookieSnapshot = { ...fakeSnapshot, timestamp: Date.now() - SNAPSHOT_TTL_MS - 1000 };
      storageMock.get.mockResolvedValueOnce({ cookieSnapshot: expired });

      const snap = await getSnapshot();

      expect(snap).toBeNull();
      expect(storageMock.remove).toHaveBeenCalledWith('cookieSnapshot');
    });

    it('keeps a fresh snapshot on read', async () => {
      const fresh: CookieSnapshot = { ...fakeSnapshot, timestamp: Date.now() - 1000 };
      storageMock.get.mockResolvedValueOnce({ cookieSnapshot: fresh });

      const snap = await getSnapshot();

      expect(snap?.sourceDomain).toBe('example.com');
      expect(storageMock.remove).not.toHaveBeenCalled();
    });
  });
});
