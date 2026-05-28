export async function getAllCookies(domain: string): Promise<chrome.cookies.Cookie[]> {
  try {
    // Query all domain levels to catch cookies set on parent domains.
    // e.g. for "a.b.example.com" → try "a.b.example.com", "b.example.com", "example.com"
    const parts = domain.toLowerCase().split('.');
    const domains: string[] = [];
    for (let i = 0; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'));
    }

    const seen = new Set<string>();
    const result: chrome.cookies.Cookie[] = [];

    for (const d of domains) {
      const batch = await chrome.cookies.getAll({ domain: d });
      for (const c of batch) {
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
    const domains: string[] = [];
    for (let i = 0; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'));
    }

    const seen = new Set<string>();
    const cookies: chrome.cookies.Cookie[] = [];

    for (const d of domains) {
      const batch = await chrome.cookies.getAll({ domain: d });
      for (const c of batch) {
        const key = `${c.name}|${c.domain}|${c.path}`;
        if (!seen.has(key)) {
          seen.add(key);
          cookies.push(c);
        }
      }
    }

    for (const cookie of cookies) {
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
    // Use https:// for secure cookies regardless of target protocol,
    // otherwise Chrome refuses to create them.
    const protocol = cookie.secure ? 'https:' : urlObj.protocol;
    const cookieUrl = `${protocol}//${urlObj.hostname}${cookie.path || '/'}`;

    const details: chrome.cookies.SetDetails = {
      url: cookieUrl,
      name: cookie.name,
      value: cookie.value,
      path: cookie.path || '/',
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
  }

  return result;
}
