import { afterEach, describe, expect, it, vi } from 'vitest';
import { DynamicFieldList } from './dynamic-field-list';

describe('field input types', () => {
  afterEach(() => document.body.replaceChildren());

  it('masks a password and preserves its value when switching types and copying', async () => {
    const list = new DynamicFieldList();
    list.mode = 'value';
    list.fields = [{ id: 'p', name: 'Password', value: 'fixture-value', inputType: 'password' }];
    document.body.append(list);
    await list.updateComplete;
    const input = () => list.shadowRoot!.querySelector<HTMLInputElement>('input[placeholder="Value"]')!;
    expect(input().type).toBe('password');
    expect(input().value).toBe('fixture-value');
    expect(input().getAttribute('value')).toBeNull();
    const changed = vi.fn();
    list.addEventListener('fields-change', changed);
    const select = list.shadowRoot!.querySelector('select')!;
    select.value = 'text';
    select.dispatchEvent(new Event('change'));
    await list.updateComplete;
    expect(input().type).toBe('text');
    expect(input().value).toBe('fixture-value');
    expect(changed.mock.calls[0][0].detail[0].inputType).toBe('text');
    select.value = 'password';
    select.dispatchEvent(new Event('change'));
    list.copyRow('p');
    await list.updateComplete;
    expect(list.fields[1].inputType).toBe('password');
    expect(list.shadowRoot!.querySelectorAll('input[type="password"]')).toHaveLength(2);
  });

  it('defaults old fields to text and supports configuring template fields', async () => {
    const list = new DynamicFieldList();
    list.fields = [{ id: 'a', name: 'Account' }];
    document.body.append(list);
    await list.updateComplete;
    expect(list.shadowRoot!.querySelector('select')!.value).toBe('text');
    expect(list.shadowRoot!.querySelector('input[placeholder="Value"]')).toBeNull();
    list.mode = 'value';
    await list.updateComplete;
    expect(list.shadowRoot!.querySelector<HTMLInputElement>('input[placeholder="Value"]')!.type).toBe('text');
  });
});
