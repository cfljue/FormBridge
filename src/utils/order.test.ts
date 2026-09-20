import { describe, it, expect } from 'vitest';
import { mergeVisibleOrder } from './order';

describe('mergeVisibleOrder', () => {
  it('reorders the visible subset and keeps hidden records in place', () => {
    // Visible (e.g. filtered) list is [b, d]; the user drags d before b.
    expect(mergeVisibleOrder(['a', 'b', 'c', 'd'], ['d', 'b'])).toEqual(['a', 'd', 'c', 'b']);
  });

  it('handles a full-length visible list', () => {
    expect(mergeVisibleOrder(['a', 'b', 'c'], ['c', 'a', 'b'])).toEqual(['c', 'a', 'b']);
  });

  it('keeps the order unchanged when nothing moved', () => {
    expect(mergeVisibleOrder(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('returns the full order when the visible list is empty', () => {
    expect(mergeVisibleOrder(['a', 'b'], [])).toEqual(['a', 'b']);
  });

  it('appends ids the stored order does not know about', () => {
    expect(mergeVisibleOrder(['a', 'b'], ['b', 'a', 'new'])).toEqual(['b', 'a', 'new']);
  });

  it('ignores duplicates in the new visible order', () => {
    expect(mergeVisibleOrder(['a', 'b'], ['b', 'b', 'a'])).toEqual(['b', 'a']);
  });

  it('drops empty ids', () => {
    expect(mergeVisibleOrder(['a', 'b'], ['', 'b', 'a'])).toEqual(['b', 'a']);
  });
});
