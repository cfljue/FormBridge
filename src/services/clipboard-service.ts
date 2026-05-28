import { type CookieSnapshot } from '@app-types/models';
import { getAllCookies } from './chrome-cookies';
import { sendToTab } from './chrome-tabs';

const SNAPSHOT_KEY = 'cookieSnapshot';

export async function saveSnapshot(snapshot: CookieSnapshot): Promise<void> {
  await chrome.storage.local.set({ [SNAPSHOT_KEY]: snapshot });
}

export async function getSnapshot(): Promise<CookieSnapshot | null> {
  const result = await chrome.storage.local.get(SNAPSHOT_KEY);
  return (result[SNAPSHOT_KEY] as CookieSnapshot) ?? null;
}

export async function clearSnapshot(): Promise<void> {
  await chrome.storage.local.remove(SNAPSHOT_KEY);
}

export async function captureFromTab(tabId: number, url: string): Promise<CookieSnapshot | null> {
  try {
    const domain = new URL(url).hostname;
    const cookies = await getAllCookies(domain);

    let ls: Record<string, string> = {};
    let ss: Record<string, string> = {};
    const storageMsg = { action: 'GET_PAGE_STORAGE' as const };
    let storageResp = await sendToTab<{ localStorage: Record<string, string>; sessionStorage: Record<string, string> }>(tabId, storageMsg);
    if (!storageResp) {
      // Content script not loaded — inject and retry
      try {
        const manifest = chrome.runtime.getManifest();
        const csFiles = manifest.content_scripts?.[0]?.js ?? [];
        if (csFiles.length > 0) {
          await chrome.scripting.executeScript({ target: { tabId }, files: csFiles });
          storageResp = await sendToTab<{ localStorage: Record<string, string>; sessionStorage: Record<string, string> }>(tabId, storageMsg);
        }
      } catch { /* still fail */ }
    }
    if (storageResp) {
      ls = storageResp.localStorage ?? {};
      ss = storageResp.sessionStorage ?? {};
    }

    const snapshot: CookieSnapshot = {
      sourceDomain: domain,
      sourceUrl: url,
      cookies,
      localStorage: ls,
      sessionStorage: ss,
      timestamp: Date.now(),
    };

    await saveSnapshot(snapshot);
    return snapshot;
  } catch {
    return null;
  }
}
