import { describe, it, expect, beforeEach } from 'vitest';
import { mockChromeCookies } from '../__tests__/chrome-mock';

let cookiesMock: ReturnType<typeof mockChromeCookies>;

// Must mock before import
cookiesMock = mockChromeCookies();

import { setCookiesBatch, removeAllCookies } from './chrome-cookies';

function makeCookie(overrides: Partial<chrome.cookies.Cookie> = {}): chrome.cookies.Cookie {
  return {
    name: 'test',
    value: 'val',
    domain: '.example.com',
    path: '/',
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    session: true,
    hostOnly: false,
    ...overrides,
  } as chrome.cookies.Cookie;
}

describe('chrome-cookies service', () => {
  beforeEach(() => {
    cookiesMock.getAll.mockClear();
    cookiesMock.set.mockClear();
    cookiesMock.remove.mockClear();
    cookiesMock.set.mockResolvedValue({} as chrome.cookies.Cookie);
    cookiesMock.remove.mockResolvedValue({} as chrome.cookies.Details);
    cookiesMock.getAll.mockResolvedValue([]);
  });

  describe('setCookiesBatch', () => {
    it('sets all cookies and returns success count', async () => {
      const cookies = [makeCookie(), makeCookie({ name: 'token', value: 'abc' })];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(cookiesMock.set).toHaveBeenCalledTimes(2);
    });

    it('sets secure cookies on HTTP target by using https:// URL', async () => {
      const cookies = [
        makeCookie({ name: 'secure1', secure: true }),
        makeCookie({ name: 'normal' }),
      ];
      const result = await setCookiesBatch(cookies, 'http://target.com');

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('sets secure cookies on HTTPS target', async () => {
      const cookies = [makeCookie({ name: 'secure1', secure: true })];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('counts failures when setCookie returns null', async () => {
      cookiesMock.set.mockResolvedValue(null);
      const cookies = [makeCookie()];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(0);
      expect(result.failed).toBe(1);
    });

    it('sets expirationDate when present on source cookie', async () => {
      const cookies = [makeCookie({ expirationDate: 9999999 })];
      await setCookiesBatch(cookies, 'https://target.com');

      expect(cookiesMock.set).toHaveBeenCalledWith(
        expect.objectContaining({ expirationDate: 9999999 })
      );
    });
  });

  describe('removeAllCookies', () => {
    it('removes all 3 cookies successfully', async () => {
      const cookies = [
        makeCookie({ name: 'a' }),
        makeCookie({ name: 'b' }),
        makeCookie({ name: 'c' }),
      ];
      cookiesMock.getAll.mockResolvedValue(cookies);

      const result = await removeAllCookies('https://example.com');

      expect(result.removed).toBe(3);
      expect(result.failed).toBe(0);
      expect(cookiesMock.remove).toHaveBeenCalledTimes(3);
    });

    it('counts 1 failed when 1 of 2 removals throws', async () => {
      const cookies = [
        makeCookie({ name: 'good' }),
        makeCookie({ name: 'bad' }),
      ];
      cookiesMock.getAll.mockResolvedValue(cookies);
      cookiesMock.remove
        .mockResolvedValueOnce({} as chrome.cookies.Details)
        .mockRejectedValueOnce(new Error('failed'));

      const result = await removeAllCookies('https://example.com');

      expect(result.removed).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('returns zeros when getAll returns empty', async () => {
      cookiesMock.getAll.mockResolvedValue([]);

      const result = await removeAllCookies('https://example.com');

      expect(result.removed).toBe(0);
      expect(result.failed).toBe(0);
      expect(cookiesMock.remove).not.toHaveBeenCalled();
    });
  });
});
