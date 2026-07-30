import { type ExtensionMessage, type AutoFillResponse } from '@app-types/messages';
import { captureFromTab, getSnapshot, clearSnapshot } from '@services/clipboard-service';
import { setCookiesBatch, removeAllCookies } from '@services/chrome-cookies';
import { sendToTabWithInjectionRetry } from '@services/chrome-tabs';

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get('settings');
  if (!result.settings) {
    await chrome.storage.local.set({ settings: { cookieCopyEnabled: false, dataCardOrder: [] } });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse).catch(() => sendResponse(null));
  return true; // async response
});

export async function handleMessage(
  message: ExtensionMessage,
  sender: chrome.runtime.MessageSender
): Promise<unknown> {
  switch (message.action) {
    case 'COPY_COOKIES': {
      const tabId = message.payload?.tabId ?? sender.tab?.id;
      if (!tabId) return { success: false, message: 'No tab' };
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url) return { success: false, message: 'No URL' };
      const snapshot = await captureFromTab(tabId, tab.url);
      if (!snapshot) return { success: false, message: 'Failed to capture' };
      const storageKeys = Object.keys(snapshot.localStorage).length + Object.keys(snapshot.sessionStorage).length;
      let msg = `Copied ${snapshot.cookies.length} cookies`;
      if (storageKeys > 0) msg += ` + ${storageKeys} storage keys`;
      msg += ` from ${snapshot.sourceDomain}`;
      return { success: true, message: msg };
    }

    case 'PASTE_COOKIES': {
      const tabId = message.payload?.tabId ?? sender.tab?.id;
      if (!tabId) return { success: false, message: 'No tab' };
      const snapshot = await getSnapshot();
      if (!snapshot) return { success: false, message: 'No snapshot. Copy first (Ctrl+C).' };

      const tab = await chrome.tabs.get(tabId);
      if (!tab.url) return { success: false, message: 'Invalid tab' };

      // Clear existing cookies before paste
      const clearResult = await removeAllCookies(tab.url);

      // Set cookies from snapshot
      const result = await setCookiesBatch(snapshot.cookies, tab.url);

      // Write storage via content script
      const storageKeys = Object.keys(snapshot.localStorage).length + Object.keys(snapshot.sessionStorage).length;
      let storageOk = false;
      if (storageKeys > 0) {
        const storagePayload = {
          action: 'SET_PAGE_STORAGE' as const,
          payload: { tabId, localStorage: snapshot.localStorage, sessionStorage: snapshot.sessionStorage },
        };
        const resp = await sendToTabWithInjectionRetry(tabId, storagePayload);
        storageOk = !!resp;
      }
      storageOk = storageOk || storageKeys === 0;

      let msg = `Cleared ${clearResult.removed} cookies`;
      if (clearResult.failed > 0) msg += ` (${clearResult.failed} failed)`;
      msg += `. Pasted ${result.success}/${result.success + result.failed} cookies`;
      if (storageKeys > 0) msg += storageOk ? ` + ${storageKeys} storage keys` : ` (storage failed)`;
      if (result.errors.length > 0) msg += `. Failed: ${result.errors.join(', ')}`;

      // Clear snapshot after paste — one-time use
      await clearSnapshot();

      // Reload target page
      await chrome.tabs.reload(tabId);

      return { success: clearResult.failed === 0 && result.failed === 0 && (storageKeys === 0 || storageOk), total: result.success + result.failed, failed: result.failed, message: msg + '. Page reloading...' };
    }

    case 'CLEAR_COOKIES': {
      const tabId = message.payload?.tabId ?? sender.tab?.id;
      if (!tabId) return { success: false, removed: 0, failed: 0, message: 'No tab' };
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url) return { success: false, removed: 0, failed: 0, message: 'No URL' };
      const result = await removeAllCookies(tab.url);
      await chrome.tabs.reload(tabId);
      const msg = `Cleared ${result.removed} cookies` + (result.failed > 0 ? `, ${result.failed} failed` : '') + '. Page reloading...';
      return {
        success: result.failed === 0,
        removed: result.removed,
        failed: result.failed,
        message: msg,
      };
    }

    case 'AUTO_FILL_FORM': {
      const p = message.payload;
      const tab = await chrome.tabs.get(p.tabId);
      if (!tab.id) return { success: false, message: 'Tab not found' };

      const response = await sendToTabWithInjectionRetry<AutoFillResponse>(p.tabId, {
        action: 'AUTO_FILL_FORM',
        payload: p,
      });

      if (!response) return { success: false, message: 'Content script not loaded. Please refresh the target page.' };
      const total = response.filled + response.selectorMissed.length + response.failed;
      let msg = `Filled ${response.filled}/${total} fields`;
      if (response.selectorMissed.length) msg += `. Name-matched (bad selector): ${response.selectorMissed.join(', ')}`;
      if (response.failedFields.length) msg += `. Missed: ${response.failedFields.join(', ')}`;
      if (response.clicked) msg += '. Button clicked!';
      return { ...response, message: msg };
    }

    case 'GET_ACTIVE_TAB_INFO': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return null;
      try {
        const url = new URL(tab.url ?? '');
        return { url: tab.url, domain: url.hostname, tabId: tab.id };
      } catch {
        return { url: tab.url ?? '', domain: '', tabId: tab.id };
      }
    }

    default:
      return null;
  }
}
