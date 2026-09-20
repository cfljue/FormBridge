import { describe, expect, it, vi } from 'vitest';
import {
  parseDataRecordArrayJson,
  parseDataRecordJson,
  parseTemplateArrayJson,
  parseTemplateJson,
} from './direct-json-import';

describe('direct JSON import', () => {
  it('preserves input types in templates and records and rejects unsupported types', () => {
    const field = { name: 'Password', selector: '#password', inputType: 'password', value: 'fixture-value' };
    expect(parseTemplateJson(JSON.stringify({ name: 'Login', fields: [field] })).fields[0].inputType).toBe('password');
    expect(parseDataRecordJson(JSON.stringify({ name: 'Account', values: [field] })).values[0]).toEqual(field);
    expect(parseDataRecordJson(JSON.stringify({ name: 'Account', values: [{ ...field, inputType: 'text' }] })).values[0].inputType).toBe('text');
    expect(() => parseTemplateJson(JSON.stringify({ name: 'Bad', fields: [{ ...field, inputType: 'file' }] }))).toThrow('inputType');
  });
  it('accepts a FormBridge template array and removes storage metadata', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');
    const result = parseTemplateJson(JSON.stringify([{
      id: 'stored-template',
      name: ' Login ',
      description: ' Test ',
      url: ' example.com/login ',
      fields: [{ name: ' Account ', selector: ' input[name=user] ' }],
      button: { name: '', selector: ' button[type=submit] ' },
      createdAt: 1,
      updatedAt: 2,
    }]));

    expect(result).toEqual({
      name: 'Login',
      description: 'Test',
      url: 'example.com/login',
      fields: [{ id: '00000000-0000-4000-8000-000000000001', name: 'Account', selector: 'input[name=user]' }],
      button: { name: 'Submit', selector: 'button[type=submit]' },
    });
    expect(result).not.toHaveProperty('id');
  });

  it('accepts one data object and preserves field values', () => {
    expect(parseDataRecordJson(JSON.stringify({
      name: 'Dev account',
      templateId: 'template-1',
      values: [{ name: 'Account', selector: '#account', value: ' alice ' }],
    }))).toEqual({
      name: 'Dev account',
      description: '',
      url: '',
      templateId: 'template-1',
      values: [{ name: 'Account', selector: '#account', value: ' alice ' }],
      buttonName: undefined,
      buttonSelector: undefined,
    });
  });

  it('rejects ambiguous arrays and malformed fields', () => {
    expect(() => parseTemplateJson('[]')).toThrow('exactly one');
    expect(() => parseDataRecordJson('{"name":"x","values":{}}')).toThrow('values must be an array');
  });

  it('rejects a value that has no selector', () => {
    expect(() => parseDataRecordJson(JSON.stringify({
      name: 'Account',
      values: [{ name: 'user', value: 'alice' }],
    }))).toThrow('values[0].selector is required');

    const result = parseDataRecordArrayJson(JSON.stringify([
      { name: 'Bad', values: [{ name: 'user', value: 'alice' }] },
    ]));
    expect(result.items).toEqual([]);
    expect(result.skipped[0].error).toContain('selector is required');
  });

  it('keeps an empty value without a selector', () => {
    const result = parseDataRecordJson(JSON.stringify({
      name: 'Account',
      values: [{ name: 'user', value: '' }],
    }));

    expect(result.values).toEqual([{ name: 'user', selector: '', value: '' }]);
  });

  it('parses arrays for batch import and reports invalid entries by index', () => {
    const result = parseDataRecordArrayJson(JSON.stringify([
      { name: 'Good', values: [{ name: 'user', selector: '#user', value: 'alice' }] },
      { name: 'Missing values' },
      { name: '', values: [] },
      'not-an-object',
    ]));

    expect(result.items.map((item) => item.name)).toEqual(['Good']);
    expect(result.skipped.map((entry) => entry.index)).toEqual([1, 2, 3]);
    expect(result.skipped[0].error).toContain('values must be an array');
    expect(result.skipped[2].error).toContain('must be a JSON object');
  });

  it('keeps identity and timestamps so a re-imported export is not duplicated', () => {
    const result = parseDataRecordArrayJson(JSON.stringify([
      { id: 'keep-me', name: 'A', values: [], order: 3, createdAt: 1, updatedAt: 2 },
    ]));
    const templates = parseTemplateArrayJson(JSON.stringify([
      { id: 'template-1', name: 'T', fields: [{ id: 'f1', name: 'user', selector: '#user' }], createdAt: 5, updatedAt: 6 },
    ]));

    expect(result.items[0]).toMatchObject({ id: 'keep-me', order: 3, createdAt: 1, updatedAt: 2 });
    expect(templates.items[0]).toMatchObject({
      id: 'template-1',
      createdAt: 5,
      updatedAt: 6,
      fields: [{ id: 'f1', name: 'user', selector: '#user' }],
    });
  });

  it('rejects batch content that is not a JSON array', () => {
    expect(() => parseDataRecordArrayJson('{"name":"x"}')).toThrow('Invalid JSON array');
    expect(() => parseTemplateArrayJson('')).toThrow('Paste JSON before saving.');
  });
});
