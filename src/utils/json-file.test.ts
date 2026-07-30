import { describe, expect, it } from 'vitest';
import { parseJsonArray } from './json-file';

describe('parseJsonArray', () => {
  it('parses a JSON array', () => {
    expect(parseJsonArray<{ id: string }>('[{"id":"one"}]')).toEqual([{ id: 'one' }]);
  });

  it('rejects non-array JSON values', () => {
    expect(() => parseJsonArray('{"id":"one"}')).toThrow('Invalid JSON array');
  });

  it('rejects malformed JSON', () => {
    expect(() => parseJsonArray('[invalid]')).toThrow();
  });
});
