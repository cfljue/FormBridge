import { type CookieSnapshot } from '@app-types/models';
import { getAllCookies } from './chrome-cookies';
import { sendToTabWithInjectionRetry } from './chrome-tabs';

const SNAPSHOT_KEY = 'cookieSnapshot';

/** Snapshots hold live session tokens, so they expire instead of lingering forever. */
export const SNAPSHOT_TTL_MS = 30 * 60 * 1000;

export function isSnapshotExpired(snapshot: Pick<CookieSnapshot, 'timestamp'>, now = Date.now()): boolean {
  if (typeof snapshot.timestamp !== 'number' || !Number.isFinite(snapshot.timestamp)) return true;
  return now - snapshot.timestamp > SNAPSHOT_TTL_MS;
}

export async function saveSnapshot(snapshot: CookieSnapshot): Promise<void> {
  await chrome.storage.local.set({ [SNAPSHOT_KEY]: snapshot });
}

export async function getSnapshot(): Promise<CookieSnapshot | null> {
  const result = await chrome.storage.local.get(SNAPSHOT_KEY);
  const snapshot = (result[SNAPSHOT_KEY] as CookieSnapshot | undefined) ?? null;
  if (!snapshot) return null;

  if (isSnapshotExpired(snapshot)) {
    await clearSnapshot();
    return null;
  }

  return snapshot;
}

export async function clearSnapshot(): Promise<void> {
  await chrome.storage.local.remove(SNAPSHOT_KEY);
}

export async function captureFromTab(tabId: number, url: string): Promise<CookieSnapshot | null> {
  try {
    const cookies = await getAllCookies(url);

    let ls: Record<string, string> = {};
    let ss: Record<string, string> = {};
    const storageMsg = { action: 'GET_PAGE_STORAGE' as const };
    const storageResp = await sendToTabWithInjectionRetry<{
      localStorage: Record<string, string>;
      sessionStorage: Record<string, string>;
    }>(tabId, storageMsg);
    if (storageResp) {
      ls = storageResp.localStorage ?? {};
      ss = storageResp.sessionStorage ?? {};
    }

    const snapshot: CookieSnapshot = {
      sourceDomain: new URL(url).hostname,
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
