import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockChromeTabs } from '../__tests__/chrome-mock';

let tabsMock: ReturnType<typeof mockChromeTabs>;

tabsMock = mockChromeTabs();

import { getActiveTab, sendToTab, sendToTabWithInjectionRetry } from './chrome-tabs';

describe('chrome-tabs service', () => {
  beforeEach(() => {
    tabsMock.query.mockClear();
    tabsMock.sendMessage.mockClear();
    (chrome as unknown as Record<string, unknown>).runtime = {
      getManifest: vi.fn(() => ({ content_scripts: [{ js: ['content.js'] }] })),
    };
    (chrome as unknown as Record<string, unknown>).scripting = {
      executeScript: vi.fn().mockResolvedValue([]),
    };
  });

  describe('getActiveTab', () => {
    it('returns the active tab', async () => {
      const fakeTab = { id: 42, url: 'https://example.com' } as chrome.tabs.Tab;
      tabsMock.query.mockResolvedValueOnce([fakeTab]);

      const tab = await getActiveTab();
      expect(tab?.id).toBe(42);
      expect(tab?.url).toBe('https://example.com');
    });

    it('returns null when no active tab', async () => {
      tabsMock.query.mockResolvedValueOnce([]);
      const tab = await getActiveTab();
      expect(tab).toBeNull();
    });
  });

  describe('sendToTab', () => {
    it('sends a message to a tab', async () => {
      tabsMock.sendMessage.mockResolvedValueOnce({ success: true });
      const response = await sendToTab(42, { action: 'TEST' });
      expect(response).toEqual({ success: true });
      expect(tabsMock.sendMessage).toHaveBeenCalledWith(42, { action: 'TEST' });
    });

    it('returns null on error', async () => {
      tabsMock.sendMessage.mockRejectedValueOnce(new Error('No connection'));
      const response = await sendToTab(99, { action: 'FAIL' });
      expect(response).toBeNull();
    });
  });

  describe('sendToTabWithInjectionRetry', () => {
    it('returns the first response without injecting', async () => {
      tabsMock.sendMessage.mockResolvedValueOnce({ success: true });

      const response = await sendToTabWithInjectionRetry(42, { action: 'TEST' });

      expect(response).toEqual({ success: true });
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });

    it('injects the content script and retries after a failed send', async () => {
      tabsMock.sendMessage
        .mockRejectedValueOnce(new Error('No receiver'))
        .mockResolvedValueOnce({ success: true });

      const response = await sendToTabWithInjectionRetry(42, { action: 'TEST' });

      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 42 },
        files: ['content.js'],
      });
      expect(tabsMock.sendMessage).toHaveBeenCalledTimes(2);
      expect(response).toEqual({ success: true });
    });

    it('retries when a send resolves without a response', async () => {
      tabsMock.sendMessage
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ success: true });

      const response = await sendToTabWithInjectionRetry(42, { action: 'TEST' });

      expect(chrome.scripting.executeScript).toHaveBeenCalledTimes(1);
      expect(tabsMock.sendMessage).toHaveBeenCalledTimes(2);
      expect(response).toEqual({ success: true });
    });

    it('returns null when no content script is declared', async () => {
      tabsMock.sendMessage.mockRejectedValueOnce(new Error('No receiver'));
      vi.mocked(chrome.runtime.getManifest).mockReturnValue({} as chrome.runtime.Manifest);

      const response = await sendToTabWithInjectionRetry(42, { action: 'TEST' });

      expect(response).toBeNull();
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });
  });
});
