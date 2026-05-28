import { describe, it, expect } from 'vitest';
import { urlMatches } from './url-matcher';

describe('urlMatches', () => {
  it('returns true when recordUrl is a substring of currentUrl', () => {
    expect(urlMatches('https://example.com/page/subpage', 'example.com')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(urlMatches('https://EXAMPLE.COM/page', 'example.com')).toBe(true);
    expect(urlMatches('https://example.com/page', 'EXAMPLE.COM')).toBe(true);
  });

  it('returns false when recordUrl is not in currentUrl', () => {
    expect(urlMatches('https://example.com/page', 'other.com')).toBe(false);
  });

  it('returns false for empty recordUrl', () => {
    expect(urlMatches('https://example.com/page', '')).toBe(false);
  });

  it('matches partial path segments', () => {
    expect(urlMatches('https://example.com/admin/users', '/admin')).toBe(true);
  });
});
