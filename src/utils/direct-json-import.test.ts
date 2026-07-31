import { describe, expect, it, vi } from 'vitest';
import { parseDataRecordJson, parseTemplateJson } from './direct-json-import';

describe('direct JSON import', () => {
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
});
