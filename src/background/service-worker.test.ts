import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ExtensionMessage } from '@app-types/messages';
import type { CookieSnapshot } from '@app-types/models';

// --- Hoisted: setup mocks before module evaluation ---

const mockGetSnapshot = vi.hoisted(() => vi.fn());
const mockClearSnapshot = vi.hoisted(() => vi.fn());
const mockRemoveAllCookies = vi.hoisted(() => vi.fn());
const mockSetCookiesBatch = vi.hoisted(() => vi.fn());
const mockSendToTab = vi.hoisted(() => vi.fn());
const mockTabsGet = vi.hoisted(() => vi.fn());
const mockTabsReload = vi.hoisted(() => vi.fn());

vi.hoisted(() => {
  (globalThis as Record<string, unknown>).chrome = {
    runtime: {
      onInstalled: { addListener: vi.fn() },
      onMessage: { addListener: vi.fn() },
    },
    tabs: { get: mockTabsGet, reload: mockTabsReload },
  } as unknown as typeof chrome;
});

vi.mock('@services/clipboard-service', () => ({
  getSnapshot: mockGetSnapshot,
  clearSnapshot: mockClearSnapshot,
  captureFromTab: vi.fn(),
}));

vi.mock('@services/chrome-cookies', () => ({
  removeAllCookies: mockRemoveAllCookies,
  setCookiesBatch: mockSetCookiesBatch,
}));

vi.mock('@services/chrome-tabs', () => ({
  sendToTab: mockSendToTab,
}));

// --- Module under test ---
import { handleMessage } from './service-worker';

// --- Helpers ---

function makeSnapshot(cookies: chrome.cookies.Cookie[] = []): CookieSnapshot {
  return {
    sourceDomain: 'example.com',
    sourceUrl: 'https://example.com',
    cookies,
    localStorage: {},
    sessionStorage: {},
    timestamp: Date.now(),
  };
}

function makeCookie(name: string): chrome.cookies.Cookie {
  return {
    name,
    value: 'val',
    domain: '.example.com',
    path: '/',
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    session: true,
    hostOnly: false,
  } as chrome.cookies.Cookie;
}

const sender = {} as chrome.runtime.MessageSender;
const pasteMessage = { action: 'PASTE_COOKIES', payload: { tabId: 1 } } as ExtensionMessage;

// --- Tests ---

describe('service-worker PASTE_COOKIES', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTabsGet.mockResolvedValue({ id: 1, url: 'https://example.com' });
    mockTabsReload.mockResolvedValue(undefined);
  });

  it('clears existing cookies and pastes snapshot — all succeed', async () => {
    const snapshot = makeSnapshot([makeCookie('a'), makeCookie('b')]);
    mockGetSnapshot.mockResolvedValue(snapshot);
    mockRemoveAllCookies.mockResolvedValue({ removed: 3, failed: 0 });
    mockSetCookiesBatch.mockResolvedValue({ success: 2, failed: 0, errors: [] });

    const result = await handleMessage(pasteMessage, sender) as Record<string, unknown>;

    expect(mockRemoveAllCookies).toHaveBeenCalledWith('https://example.com');
    expect(mockSetCookiesBatch).toHaveBeenCalledWith(snapshot.cookies, 'https://example.com');
    expect(mockClearSnapshot).toHaveBeenCalled();
    expect(mockTabsReload).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      success: true,
      total: 2,
      failed: 0,
      message: expect.stringContaining('Cleared 3 cookies. Pasted 2/2 cookies. Page reloading...'),
    });
  });

  it('returns error when no snapshot exists', async () => {
    mockGetSnapshot.mockResolvedValue(null);

    const result = await handleMessage(pasteMessage, sender);

    expect(result).toEqual({
      success: false,
      message: 'No snapshot. Copy first (Ctrl+C).',
    });
    expect(mockRemoveAllCookies).not.toHaveBeenCalled();
    expect(mockClearSnapshot).not.toHaveBeenCalled();
  });

  it('returns partial failure when clear stage has failures', async () => {
    mockGetSnapshot.mockResolvedValue(makeSnapshot([makeCookie('a'), makeCookie('b')]));
    mockRemoveAllCookies.mockResolvedValue({ removed: 2, failed: 1 });
    mockSetCookiesBatch.mockResolvedValue({ success: 2, failed: 0, errors: [] });

    const result = await handleMessage(pasteMessage, sender) as Record<string, unknown>;

    expect(result.success).toBe(false);
    expect(result.failed).toBe(0);
    expect(result.message as string).toContain('(1 failed)');
  });

  it('handles empty cookie list — only clear, no set loop', async () => {
    mockGetSnapshot.mockResolvedValue(makeSnapshot([]));
    mockRemoveAllCookies.mockResolvedValue({ removed: 3, failed: 0 });
    mockSetCookiesBatch.mockResolvedValue({ success: 0, failed: 0, errors: [] });

    const result = await handleMessage(pasteMessage, sender) as Record<string, unknown>;

    expect(mockRemoveAllCookies).toHaveBeenCalled();
    expect(mockSetCookiesBatch).toHaveBeenCalledWith([], 'https://example.com');
    expect(result.success).toBe(true);
  });

  it('returns error when tab has no URL', async () => {
    mockGetSnapshot.mockResolvedValue(makeSnapshot([makeCookie('a')]));
    mockTabsGet.mockResolvedValue({ id: 1, url: undefined });

    const result = await handleMessage(pasteMessage, sender);

    expect(result).toEqual({
      success: false,
      message: 'Invalid tab',
    });
  });

  it('returns error when payload has no tabId and sender has no tab', async () => {
    const result = await handleMessage(
      { action: 'PASTE_COOKIES' } as ExtensionMessage,
      {} as chrome.runtime.MessageSender,
    );

    expect(result).toEqual({
      success: false,
      message: 'No tab',
    });
  });
});
