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
  /** Partitioned (CHIPS) cookies are not copied: their partition key cannot be re-created. */
  partitionedSkipped: number;
  /** Cookies scoped to a parent domain that the target host cannot carry; written host-only. */
  scopeLost: number;
  /** Extra path=/ copies written for source cookies that lived on a narrower path. */
  rootCopies: number;
  errors: string[];
}

export interface CookieRemoveResult {
  removed: number;
  failed: number;
}

function hostMatchesDomain(host: string, domain: string): boolean {
  const normalized = domain.startsWith('.') ? domain.slice(1) : domain;
  if (!normalized) return false;
  return host === normalized || host.endsWith(`.${normalized}`);
}

export interface CookieWriteScope {
  /** Domain attribute to keep. When absent the cookie is written host-only for the target host. */
  domain?: string;
  /** True for partitioned cookies, which are skipped instead of being re-created unpartitioned. */
  partitioned: boolean;
  /** True when the source domain cookie cannot be carried over by the target host. */
  scopeLost: boolean;
}

/**
 * Decides how a source cookie should be written to the target host:
 * keeping a parent-domain scope when the target still matches it (subdomain to sibling
 * subdomain), dropping it when the target is a different site, and skipping partitioned cookies.
 */
export function resolveWriteScope(
  cookie: Pick<chrome.cookies.Cookie, 'domain' | 'hostOnly' | 'partitionKey'>,
  targetHost: string
): CookieWriteScope {
  if (cookie.partitionKey) return { partitioned: true, scopeLost: false };
  // Host-only cookies stay host-only: adding a domain would silently widen their scope.
  if (cookie.hostOnly) return { partitioned: false, scopeLost: false };
  if (cookie.domain && hostMatchesDomain(targetHost, cookie.domain)) {
    return { domain: cookie.domain, partitioned: false, scopeLost: false };
  }
  return { partitioned: false, scopeLost: true };
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
  const result: CookieSetResult = {
    success: 0,
    failed: 0,
    partitionedSkipped: 0,
    scopeLost: 0,
    rootCopies: 0,
    errors: [],
  };
  const urlObj = new URL(targetUrl);
  const host = urlObj.hostname;
  const written = new Set<string>();

  for (const cookie of cookies) {
    const scope = resolveWriteScope(cookie, host);
    if (scope.partitioned) {
      result.partitionedSkipped++;
      continue;
    }

    const protocol = cookie.secure ? 'https:' : urlObj.protocol;
    const originalPath = cookie.path || '/';

    // If the original cookie path is not /, also write a copy at / so the cookie is visible on
    // all pages of the target site (the point of the prod-to-localhost workflow).
    const paths = originalPath === '/' ? [originalPath] : [originalPath, '/'];

    for (const path of paths) {
      // Same name + domain + path would overwrite an earlier write, which used to inflate the
      // reported success count.
      const key = `${cookie.name}|${scope.domain ?? host}|${path}`;
      if (written.has(key)) continue;
      written.add(key);

      const details: chrome.cookies.SetDetails = {
        url: `${protocol}//${host}${path}`,
        name: cookie.name,
        value: cookie.value,
        path,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure ?? false,
        sameSite: cookie.sameSite,
      };

      if (scope.domain) details.domain = scope.domain;
      if (cookie.expirationDate) details.expirationDate = cookie.expirationDate;

      const set = await setCookie(details);
      if (set) {
        result.success++;
        if (path === '/' && originalPath !== '/') result.rootCopies++;
      } else {
        result.failed++;
        result.errors.push(`${cookie.name}: failed to set`);
      }
    }

    if (scope.scopeLost) result.scopeLost++;
  }

  return result;
}
