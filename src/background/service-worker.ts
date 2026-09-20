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

// A copied session must not survive a browser restart.
chrome.runtime.onStartup.addListener(() => {
  void clearSnapshot();
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

      const parts = [`Cleared ${clearResult.removed} cookies`];
      if (clearResult.failed > 0) parts.push(`${clearResult.failed} could not be cleared`);
      parts.push(`Pasted ${result.success}/${result.success + result.failed} cookies`);
      if (result.rootCopies > 0) parts.push(`${result.rootCopies} extra path=/ copies added`);
      if (result.partitionedSkipped > 0) parts.push(`${result.partitionedSkipped} partitioned cookie(s) skipped`);
      if (result.scopeLost > 0) parts.push(`${result.scopeLost} cookie(s) written host-only (parent-domain scope lost)`);
      if (storageKeys > 0) parts.push(storageOk ? `${storageKeys} storage keys written` : 'storage failed');
      if (result.errors.length > 0) parts.push(`Failed: ${result.errors.join(', ')}`);

      // Clear snapshot after paste — one-time use
      await clearSnapshot();

      // Reload target page
      await chrome.tabs.reload(tabId);

      return {
        success: clearResult.failed === 0 && result.failed === 0 && (storageKeys === 0 || storageOk),
        total: result.success + result.failed,
        failed: result.failed,
        partitionedSkipped: result.partitionedSkipped,
        scopeLost: result.scopeLost,
        rootCopies: result.rootCopies,
        message: parts.join('. ') + '. Page reloading...',
      };
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
      try {
        await chrome.tabs.get(p.tabId);
      } catch {
        return { success: false, message: 'Tab not found' };
      }

      const response = await sendToTabWithInjectionRetry<AutoFillResponse>(p.tabId, {
        action: 'AUTO_FILL_FORM',
        payload: p,
      });

      if (!response) return { success: false, message: 'Content script not loaded. Please refresh the target page.' };

      const total =
        response.filled + response.failed + response.selectorMissed.length + response.invalidSelectors.length;
      const parts = [`Filled ${response.filled}/${total} fields`];
      if (response.selectorMissed.length) parts.push(`matched by field name instead: ${response.selectorMissed.join(', ')}`);
      if (response.invalidSelectors.length) parts.push(`invalid selectors, skipped: ${response.invalidSelectors.join(', ')}`);
      if (response.failedFields.length) parts.push(`no match: ${response.failedFields.join(', ')}`);
      if (response.buttonInvalid) parts.push('button selector is invalid, not clicked');
      if (response.clicked) parts.push('button clicked');

      return { ...response, total, success: true, message: parts.join('. ') };
    }

    default:
      return null;
  }
}
