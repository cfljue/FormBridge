import { describe, it, expect, beforeEach } from 'vitest';
import { mockChromeTabs } from '../__tests__/chrome-mock';

let tabsMock: ReturnType<typeof mockChromeTabs>;

tabsMock = mockChromeTabs();

import { getActiveTab, sendToTab } from './chrome-tabs';

describe('chrome-tabs service', () => {
  beforeEach(() => {
    tabsMock.query.mockClear();
    tabsMock.sendMessage.mockClear();
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
});
