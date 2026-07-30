export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

export async function navigateTo(url: string): Promise<chrome.tabs.Tab | null> {
  try {
    return await chrome.tabs.create({ url });
  } catch {
    return null;
  }
}

export async function sendToTab<T = unknown>(
  tabId: number,
  message: unknown
): Promise<T | null> {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch {
    return null;
  }
}

export async function sendToTabWithInjectionRetry<T = unknown>(
  tabId: number,
  message: unknown
): Promise<T | null> {
  const response = await sendToTab<T>(tabId, message);
  if (response != null) return response;

  try {
    const files = chrome.runtime.getManifest().content_scripts?.[0]?.js ?? [];
    if (files.length === 0) return null;
    await chrome.scripting.executeScript({ target: { tabId }, files });
    return await sendToTab<T>(tabId, message);
  } catch {
    return null;
  }
}
