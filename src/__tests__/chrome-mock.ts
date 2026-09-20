import { vi } from 'vitest';

export interface ChromeStorageMock {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  onChanged: {
    addListener: ReturnType<typeof vi.fn>;
    removeListener: ReturnType<typeof vi.fn>;
  };
  local: ChromeStorageMock;
}

export function createStorageMock(initialData: Record<string, unknown> = {}): ChromeStorageMock {
  let data = { ...initialData };
  const listeners: Array<(changes: Record<string, chrome.storage.StorageChange>) => void> = [];

  const get = vi.fn(async (keys: string | string[] | null) => {
    if (keys === null || keys === undefined) return { ...data };
    const keyList = Array.isArray(keys) ? keys : [keys];
    const result: Record<string, unknown> = {};
    for (const k of keyList) {
      if (k in data) result[k] = data[k];
    }
    return result;
  });

  const set = vi.fn(async (items: Record<string, unknown>) => {
    const changes: Record<string, chrome.storage.StorageChange> = {};
    for (const [k, v] of Object.entries(items)) {
      changes[k] = { oldValue: data[k], newValue: v };
      data[k] = v;
    }
    for (const fn of listeners) fn(changes);
  });

  const remove = vi.fn(async (keys: string | string[]) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const k of keyList) delete data[k];
  });

  const onChanged = {
    addListener: vi.fn((fn: (changes: Record<string, chrome.storage.StorageChange>) => void) => {
      listeners.push(fn);
    }),
    removeListener: vi.fn((fn: (changes: Record<string, chrome.storage.StorageChange>) => void) => {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }),
  };

  const storageMock: ChromeStorageMock = { get, set, remove, onChanged } as ChromeStorageMock;
  storageMock.local = storageMock;
  return storageMock;
}

export function mockChromeStorage(initialData?: Record<string, unknown>) {
  const mock = createStorageMock(initialData);
  (globalThis as Record<string, unknown>).chrome = {
    ...((globalThis as Record<string, unknown>).chrome as Record<string, unknown> ?? {}),
    storage: mock,
  };
  return mock;
}

export function mockChromeCookies() {
  const getAll = vi.fn(async (_details: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]> => []);
  const set = vi.fn(async (_details: chrome.cookies.SetDetails): Promise<chrome.cookies.Cookie | null> => ({} as chrome.cookies.Cookie));
  const remove = vi.fn(async (_details: chrome.cookies.CookieDetails): Promise<chrome.cookies.CookieDetails> => ({} as chrome.cookies.CookieDetails));

  (globalThis as Record<string, unknown>).chrome = {
    ...((globalThis as Record<string, unknown>).chrome as Record<string, unknown> ?? {}),
    cookies: { getAll, set, remove },
  };
  return { getAll, set, remove };
}

export function mockChromeTabs() {
  const query = vi.fn(async (_info: chrome.tabs.QueryInfo) => [] as chrome.tabs.Tab[]);
  const get = vi.fn(async (_tabId: number) => ({} as chrome.tabs.Tab));
  const sendMessage = vi.fn(async (_tabId: number, _message: unknown): Promise<unknown> => null);
  const create = vi.fn(async (_createProperties: chrome.tabs.CreateProperties) => ({} as chrome.tabs.Tab));
  const reload = vi.fn(async (_tabId?: number) => undefined);

  (globalThis as Record<string, unknown>).chrome = {
    ...((globalThis as Record<string, unknown>).chrome as Record<string, unknown> ?? {}),
    tabs: { query, get, sendMessage, create, reload },
  };
  return { query, get, sendMessage, create, reload };
}

export function mockChromeRuntime() {
  const sendMessage = vi.fn(async (_message: unknown): Promise<unknown> => null);
  const messageListeners: Array<(message: unknown, sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => boolean | void> = [];

  const onMessage = {
    addListener: vi.fn((fn: (...args: unknown[]) => unknown) => {
      messageListeners.push(fn as (message: unknown, sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => boolean | void);
    }),
    removeListener: vi.fn((fn: (...args: unknown[]) => unknown) => {
      const idx = messageListeners.indexOf(fn as (message: unknown, sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => boolean | void);
      if (idx >= 0) messageListeners.splice(idx, 1);
    }),
  };

  (globalThis as Record<string, unknown>).chrome = {
    ...((globalThis as Record<string, unknown>).chrome as Record<string, unknown> ?? {}),
    runtime: { sendMessage, onMessage },
  };
  return { sendMessage, onMessage, messageListeners };
}

export type ChromeMessageListener = (
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => boolean | void;

/**
 * Invokes a listener captured by `mockChromeRuntime().messageListeners` and resolves with the
 * value passed to `sendResponse`. Listeners that never respond keep the promise pending.
 */
export function dispatchMessage(listener: ChromeMessageListener, message: unknown): Promise<unknown> {
  return new Promise((resolve) => {
    listener(message, {} as chrome.runtime.MessageSender, resolve);
  });
}

export function clearChromeMock() {
  delete (globalThis as Record<string, unknown>).chrome;
}
