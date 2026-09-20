import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockChromeRuntime, dispatchMessage, type ChromeMessageListener } from '../__tests__/chrome-mock';
import type { AutoFillResponse } from '@app-types/messages';
import type { DataFieldValue, DataRecord } from '@app-types/models';

// The content script registers its listener at import time, so the chrome mock must exist first.
const runtime = mockChromeRuntime();
await import('./content-script');
const listener = runtime.messageListeners[0] as ChromeMessageListener;

function record(values: DataFieldValue[], buttonSelector?: string): DataRecord {
  return {
    id: 'record-1',
    name: 'Record',
    description: '',
    url: '',
    templateId: '',
    values,
    buttonSelector,
    order: 0,
    createdAt: 0,
    updatedAt: 0,
  };
}

function fill(target: DataRecord): Promise<AutoFillResponse> {
  return dispatchMessage(listener, {
    action: 'AUTO_FILL_FORM',
    payload: { tabId: 1, record: target },
  }) as Promise<AutoFillResponse>;
}

describe('content script AUTO_FILL_FORM', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('fills a field matched by selector and dispatches framework events', async () => {
    document.body.innerHTML = '<input id="user" />';
    const input = document.getElementById('user') as HTMLInputElement;
    const fired: string[] = [];
    for (const name of ['input', 'change', 'blur']) {
      input.addEventListener(name, () => fired.push(name));
    }

    const result = await fill(record([{ name: 'user', selector: '#user', value: 'alice' }]));

    expect(result.filled).toBe(1);
    expect(result.invalidSelectors).toEqual([]);
    expect(input.value).toBe('alice');
    expect(fired).toEqual(['input', 'change', 'blur']);
  });

  it('skips a field with an empty selector instead of failing the whole fill', async () => {
    document.body.innerHTML = '<input id="user" />';

    const result = await fill(
      record([
        { name: 'broken', selector: '', value: 'x' },
        { name: 'user', selector: '#user', value: 'alice' },
      ])
    );

    expect(result.filled).toBe(1);
    expect(result.invalidSelectors).toEqual(['broken']);
    expect((document.getElementById('user') as HTMLInputElement).value).toBe('alice');
  });

  it('treats a malformed selector as invalid without throwing', async () => {
    document.body.innerHTML = '<input id="user" />';

    const result = await fill(
      record([
        { name: 'broken', selector: 'input[', value: 'x' },
        { name: 'user', selector: '#user', value: 'alice' },
      ])
    );

    expect(result.invalidSelectors).toEqual(['broken']);
    expect(result.filled).toBe(1);
  });

  it('falls back to name matching and reports it as a selector miss', async () => {
    document.body.innerHTML = '<input name="user" />';

    const result = await fill(record([{ name: 'user', selector: '#missing', value: 'alice' }]));

    expect(result.filled).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.selectorMissed).toEqual(['user (#missing)']);
    expect((document.querySelector('[name=user]') as HTMLInputElement).value).toBe('alice');
  });

  it('does not fall back to the first field on the page when the field name is empty', async () => {
    document.body.innerHTML = '<input id="search" /><input id="user" />';

    const result = await fill(record([{ name: '', selector: '#missing', value: 'oops' }]));

    expect(result.failed).toBe(1);
    expect((document.getElementById('search') as HTMLInputElement).value).toBe('');
  });

  it('ignores fields without a value', async () => {
    document.body.innerHTML = '<input id="user" />';

    const result = await fill(record([{ name: 'user', selector: '', value: '' }]));

    expect(result.filled).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.invalidSelectors).toEqual([]);
  });

  it('reports an invalid button selector without losing the filled fields', async () => {
    document.body.innerHTML = '<input id="user" /><button id="go"></button>';

    const result = await fill(record([{ name: 'user', selector: '#user', value: 'alice' }], 'button['));

    expect(result.filled).toBe(1);
    expect(result.buttonInvalid).toBe(true);
    expect(result.clicked).toBe(false);
  });

  it('clicks the configured button', async () => {
    document.body.innerHTML = '<input id="user" /><button id="go"></button>';
    const onClick = vi.fn();
    document.getElementById('go')?.addEventListener('click', onClick);

    const result = await fill(record([{ name: 'user', selector: '#user', value: 'alice' }], '#go'));

    expect(result.clicked).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
