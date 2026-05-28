export async function getLocal<T>(keys: string | string[]): Promise<Record<string, T>> {
  return chrome.storage.local.get(keys) as Promise<Record<string, T>>;
}

export async function setLocal(items: Record<string, unknown>): Promise<void> {
  return chrome.storage.local.set(items);
}

export async function removeLocal(keys: string | string[]): Promise<void> {
  return chrome.storage.local.remove(keys);
}

export function onStorageChanged(
  callback: (changes: Record<string, chrome.storage.StorageChange>) => void
): () => void {
  chrome.storage.onChanged.addListener(callback);
  return () => chrome.storage.onChanged.removeListener(callback);
}
