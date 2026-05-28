import { describe, it, expect } from 'vitest';
import { fuzzySearch } from './fuzzy-search';

interface TestItem {
  id: number;
  name: string;
  category: string;
}

const items: TestItem[] = [
  { id: 1, name: 'Login Form', category: 'auth' },
  { id: 2, name: 'Signup Page', category: 'auth' },
  { id: 3, name: 'Dashboard', category: 'main' },
  { id: 4, name: 'Settings', category: 'main' },
];

describe('fuzzySearch', () => {
  it('returns all items when query is empty', () => {
    expect(fuzzySearch(items, '', ['name'])).toEqual(items);
  });

  it('filters by a single key', () => {
    const result = fuzzySearch(items, 'login', ['name']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('is case insensitive', () => {
    const result = fuzzySearch(items, 'LOGIN', ['name']);
    expect(result).toHaveLength(1);
  });

  it('searches across multiple keys', () => {
    const result = fuzzySearch(items, 'auth', ['name', 'category']);
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no match', () => {
    expect(fuzzySearch(items, 'nonexistent', ['name'])).toHaveLength(0);
  });

  it('matches partial substrings', () => {
    const result = fuzzySearch(items, 'dash', ['name']);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dashboard');
  });
});
