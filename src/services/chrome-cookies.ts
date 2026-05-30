function isCookieVisibleOn(cookie: chrome.cookies.Cookie, hostname: string): boolean {
  const d = cookie.domain;
  if (d === hostname) return true;
  if (d.startsWith('.') && hostname.endsWith(d)) return true;
  if (!d.startsWith('.') && hostname.endsWith('.' + d)) return true;
  return false;
}

export async function getAllCookies(url: string): Promise<chrome.cookies.Cookie[]> {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const parts = hostname.split('.');

    const domains: string[] = [hostname];
    for (let i = 1; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'));
    }

    const seen = new Set<string>();
    const result: chrome.cookies.Cookie[] = [];

    for (const domain of domains) {
      const batch = await chrome.cookies.getAll({ domain });
      for (const c of batch) {
        if (!isCookieVisibleOn(c, hostname)) continue;
        const key = `${c.name}|${c.domain}|${c.path}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(c);
        }
      }
    }

    return result;
  } catch {
    return [];
  }
}

export async function setCookie(
  details: chrome.cookies.SetDetails
): Promise<chrome.cookies.Cookie | null> {
  try {
    return await chrome.cookies.set(details);
  } catch {
    return null;
  }
}

export interface CookieSetResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface CookieRemoveResult {
  removed: number;
  failed: number;
}

export async function removeAllCookies(url: string): Promise<CookieRemoveResult> {
  const result: CookieRemoveResult = { removed: 0, failed: 0 };
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const parts = hostname.split('.');

    const domains: string[] = [hostname];
    for (let i = 1; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'));
    }

    const seen = new Set<string>();

    for (const domain of domains) {
      const batch = await chrome.cookies.getAll({ domain });
      for (const cookie of batch) {
        if (!isCookieVisibleOn(cookie, hostname)) continue;
        const key = `${cookie.name}|${cookie.domain}|${cookie.path}`;
        if (seen.has(key)) continue;
        seen.add(key);

        try {
          const cookieDomain = (cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain);
          const protocol = cookie.secure ? 'https:' : 'http:';
          const removeUrl = `${protocol}//${cookieDomain}${cookie.path || '/'}`;
          await chrome.cookies.remove({ url: removeUrl, name: cookie.name });
          result.removed++;
        } catch {
          result.failed++;
        }
      }
    }
  } catch {
    // getAll failed — no cookies to remove
  }
  return result;
}

export async function setCookiesBatch(
  cookies: chrome.cookies.Cookie[],
  targetUrl: string
): Promise<CookieSetResult> {
  const result: CookieSetResult = { success: 0, failed: 0, errors: [] };
  const urlObj = new URL(targetUrl);

  for (const cookie of cookies) {
    const protocol = cookie.secure ? 'https:' : urlObj.protocol;
    const originalPath = cookie.path || '/';
    const cookieUrl = `${protocol}//${urlObj.hostname}${originalPath}`;

    const details: chrome.cookies.SetDetails = {
      url: cookieUrl,
      name: cookie.name,
      value: cookie.value,
      path: originalPath,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure ?? false,
      sameSite: cookie.sameSite as chrome.cookies.SameSiteStatus | undefined,
    };

    if (cookie.expirationDate) {
      details.expirationDate = cookie.expirationDate;
    }

    const set = await setCookie(details);
    if (set) {
      result.success++;
    } else {
      result.failed++;
      result.errors.push(`${cookie.name}: failed to set`);
    }

    // If the original cookie path is not /, also write a copy at /
    // so the cookie is visible on all pages under the domain.
    if (originalPath !== '/') {
      const rootDetails: chrome.cookies.SetDetails = {
        url: `${protocol}//${urlObj.hostname}/`,
        name: cookie.name,
        value: cookie.value,
        path: '/',
        httpOnly: cookie.httpOnly,
        secure: cookie.secure ?? false,
        sameSite: cookie.sameSite as chrome.cookies.SameSiteStatus | undefined,
      };

      if (cookie.expirationDate) {
        rootDetails.expirationDate = cookie.expirationDate;
      }

      const rootSet = await setCookie(rootDetails);
      if (rootSet) {
        result.success++;
      } else {
        result.failed++;
        result.errors.push(`${cookie.name} (path=/): failed to set`);
      }
    }
  }

  return result;
}
