import { describe, it, expect, beforeEach } from 'vitest';
import { mockChromeCookies } from '../__tests__/chrome-mock';

let cookiesMock: ReturnType<typeof mockChromeCookies>;

// Must mock before import
cookiesMock = mockChromeCookies();

import { setCookiesBatch, removeAllCookies, resolveWriteScope } from './chrome-cookies';

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
    cookiesMock.remove.mockResolvedValue({} as chrome.cookies.CookieDetails);
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

    it('also creates a path=/ copy when original path is not /', async () => {
      const cookies = [makeCookie({ name: 'token', path: '/app' })];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(cookiesMock.set).toHaveBeenCalledTimes(2);
      expect(cookiesMock.set).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'token', path: '/app' })
      );
      expect(cookiesMock.set).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'token', path: '/' })
      );
    });

    it('does not duplicate when original path is /', async () => {
      const cookies = [makeCookie({ name: 'token', path: '/' })];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(1);
      expect(cookiesMock.set).toHaveBeenCalledTimes(1);
    });

    it('does not duplicate when original path is empty (defaults to /)', async () => {
      const cookies = [makeCookie({ name: 'token', path: '' })];
      const result = await setCookiesBatch(cookies, 'https://target.com');

      expect(result.success).toBe(1);
      expect(cookiesMock.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('cookie scope fidelity', () => {
    function lastSetDetails(): chrome.cookies.SetDetails {
      return cookiesMock.set.mock.calls[cookiesMock.set.mock.calls.length - 1][0] as chrome.cookies.SetDetails;
    }

    it('keeps a parent-domain scope when the target is one of its subdomains', async () => {
      const cookies = [makeCookie({ name: 'sso', domain: '.example.com', hostOnly: false })];

      const result = await setCookiesBatch(cookies, 'https://app.example.com/dashboard');

      expect(lastSetDetails()).toMatchObject({ domain: '.example.com', url: 'https://app.example.com/', path: '/' });
      expect(result.scopeLost).toBe(0);
    });

    it('writes host-only and counts a lost scope when the target is a different site', async () => {
      const cookies = [makeCookie({ name: 'sso', domain: '.example.com', hostOnly: false })];

      const result = await setCookiesBatch(cookies, 'http://localhost:3000/');

      const details = lastSetDetails();
      // Cookies are not port-specific, so the host alone is the write target.
      expect(details.url).toBe('http://localhost/');
      expect(details.domain).toBeUndefined();
      expect(result.scopeLost).toBe(1);
    });

    it('never widens a host-only cookie into a domain cookie', async () => {
      const cookies = [makeCookie({ name: 'sid', domain: 'app.example.com', hostOnly: true })];

      const result = await setCookiesBatch(cookies, 'https://app.example.com/');

      expect(lastSetDetails().domain).toBeUndefined();
      expect(result.scopeLost).toBe(0);
    });

    it('skips partitioned cookies and reports them', async () => {
      const cookies = [
        makeCookie({ name: 'chips', partitionKey: { topLevelSite: 'https://example.com' } }),
        makeCookie({ name: 'plain' }),
      ];

      const result = await setCookiesBatch(cookies, 'https://example.com/');

      expect(result.partitionedSkipped).toBe(1);
      expect(cookiesMock.set).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(1);
    });

    it('counts a single root copy when two source paths collapse into the same target', async () => {
      const cookies = [
        makeCookie({ name: 'token', path: '/app' }),
        makeCookie({ name: 'token', path: '/other' }),
      ];

      const result = await setCookiesBatch(cookies, 'https://example.com/');

      expect(cookiesMock.set).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(3);
      expect(result.rootCopies).toBe(1);
    });
  });

  describe('resolveWriteScope', () => {
    it('matches a bare domain against its subdomains but not lookalike hosts', () => {
      expect(resolveWriteScope({ domain: 'example.com', hostOnly: false }, 'app.example.com').domain).toBe('example.com');
      expect(resolveWriteScope({ domain: 'example.com', hostOnly: false }, 'notexample.com').domain).toBeUndefined();
      expect(resolveWriteScope({ domain: 'example.com', hostOnly: false }, 'example.com').domain).toBe('example.com');
    });

    it('flags partitioned cookies before anything else', () => {
      const scope = resolveWriteScope(
        { domain: '.example.com', hostOnly: false, partitionKey: { topLevelSite: 'https://example.com' } },
        'app.example.com'
      );

      expect(scope).toEqual({ partitioned: true, scopeLost: false });
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

      const result = await removeAllCookies('https://sub.example.com');

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
        .mockResolvedValueOnce({} as chrome.cookies.CookieDetails)
        .mockRejectedValueOnce(new Error('failed'));

      const result = await removeAllCookies('https://sub.example.com');

      expect(result.removed).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('returns zeros when getAll returns empty', async () => {
      cookiesMock.getAll.mockResolvedValue([]);

      const result = await removeAllCookies('https://sub.example.com');

      expect(result.removed).toBe(0);
      expect(result.failed).toBe(0);
      expect(cookiesMock.remove).not.toHaveBeenCalled();
    });
  });
});
