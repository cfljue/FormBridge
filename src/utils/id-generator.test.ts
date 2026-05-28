import { describe, it, expect } from 'vitest';
import { generateId } from './id-generator';

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique values on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('returns a UUID-like string (contains dashes)', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f-]+$/i);
    expect(id.split('-').length).toBe(5);
  });
});
