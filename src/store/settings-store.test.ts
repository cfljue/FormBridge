import { describe, it, expect, beforeEach } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

// Must mock chrome.storage BEFORE importing the store (module-level singleton)
const storageMock = createStorageMock();
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { settingsStore } from './settings-store';

describe('SettingsStore', () => {
  beforeEach(async () => {
    // Reset mock storage data
    storageMock.set.mockClear();
    storageMock.get.mockClear();
    // Reset store to defaults and reload
    await settingsStore.load();
  });

  it('has sensible defaults', () => {
    expect(settingsStore.isCookieCopyEnabled).toBe(false);
    expect(settingsStore.dataCardOrder).toEqual([]);
    expect(settingsStore.language).toBe('en');
    expect(settingsStore.popupWidth).toBe(600);
  });

  it('setCookieCopyEnabled updates state and persists', async () => {
    await settingsStore.setCookieCopyEnabled(true);
    expect(settingsStore.isCookieCopyEnabled).toBe(true);
    expect(storageMock.set).toHaveBeenCalledWith({ settings: expect.objectContaining({ cookieCopyEnabled: true }) });
  });

  it('setDataCardOrder updates and persists', async () => {
    await settingsStore.setDataCardOrder(['a', 'b', 'c']);
    expect(settingsStore.dataCardOrder).toEqual(['a', 'b', 'c']);
    expect(storageMock.set).toHaveBeenCalled();
  });

  it('setLanguage updates state and persists', async () => {
    await settingsStore.setLanguage('zh');
    expect(settingsStore.language).toBe('zh');
    expect(storageMock.set).toHaveBeenCalled();
    // Reset
    await settingsStore.setLanguage('en');
  });

  it('setPopupWidth updates and persists', async () => {
    await settingsStore.setPopupWidth(800);
    expect(settingsStore.popupWidth).toBe(800);
    expect(storageMock.set).toHaveBeenCalled();
  });

  it('load merges stored values with defaults', async () => {
    storageMock.get.mockResolvedValueOnce({
      settings: { cookieCopyEnabled: true, popupWidth: 400 },
    });
    await settingsStore.load();
    expect(settingsStore.isCookieCopyEnabled).toBe(true);
    expect(settingsStore.popupWidth).toBe(400);
    // Defaults are preserved for missing keys
    expect(settingsStore.language).toBe('en');
    expect(settingsStore.dataCardOrder).toEqual([]);
  });
});
