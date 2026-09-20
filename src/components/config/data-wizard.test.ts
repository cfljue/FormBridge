import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockChromeStorage } from '../../__tests__/chrome-mock';
import { templateStore } from '../../store/template-store';
import { DataWizard } from './data-wizard';
import type { FormConfig } from '../shared/form-config';
import { dataRecordStore } from '../../store/data-record-store';
import type { DynamicFieldList } from '../shared/dynamic-field-list';

describe('data wizard repeated creation', () => {
  let wizard: DataWizard;
  const templates = [
    { id: 'a', name: 'Account A', description: 'First', url: 'a.test', fields: [{ id: 'fa', name: 'User', selector: '#user' }], button: { name: 'Login', selector: '#login' }, createdAt: 1, updatedAt: 1 },
    { id: 'b', name: 'Account B', description: 'Second', url: 'b.test', fields: [{ id: 'fb', name: 'Email', selector: '#email' }], createdAt: 1, updatedAt: 1 },
  ];
  const form = () => wizard.shadowRoot!.querySelector<FormConfig>('form-config')!;
  async function settle() {
    await wizard.updateComplete;
    if (form()) await form().updateComplete;
  }
  async function select(id: string) {
    const input = wizard.shadowRoot!.querySelector('select')!;
    input.value = id;
    input.dispatchEvent(new Event('change'));
    await settle();
  }
  function save() {
    wizard.shadowRoot!.querySelector<HTMLButtonElement>('.btn-primary')!.click();
  }
  beforeEach(async () => {
    mockChromeStorage({ templates });
    await templateStore.load();
    wizard = new DataWizard();
    document.body.append(wizard);
    await settle();
    wizard.open();
    await settle();
  });
  afterEach(async () => {
    // Consume any deliberately retained draft through the public submit path.
    wizard.mode = 'edit';
    wizard.open();
    await settle();
    await select('a');
    save();
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });
  it('starts empty after saving, and lets the same template be selected again', async () => {
    await select('a');
    const submitted = vi.fn();
    wizard.addEventListener('data-submit', submitted);
    save();
    expect(submitted).toHaveBeenCalledOnce();
    wizard.open();
    await settle();
    expect(form().name).toBe('');
    expect(form().fields).toEqual([]);
    expect(wizard.shadowRoot!.querySelector('select')!.value).toBe('');
    await select('a');
    expect(form().name).toBe('Account A');
  });
  it('replaces template metadata and clears a previous submit button', async () => {
    await select('a');
    await select('b');
    expect(form().name).toBe('Account B');
    expect(form().url).toBe('b.test');
    expect(form().description).toBe('Second');
    expect(form().fields).toEqual([{ ...templates[1].fields[0], value: '' }]);
    expect(form().buttonName).toBe('');
    expect(form().buttonSelector).toBe('');
  });
  it('restores cancelled input in manual mode and allows choosing a template', async () => {
    await select('a');
    const input = form().shadowRoot!.querySelector('input')!;
    input.value = 'Unfinished account';
    input.dispatchEvent(new Event('input'));
    await settle();
    wizard.close();
    wizard.open();
    await settle();
    expect(form().name).toBe('Unfinished account');
    expect(wizard.shadowRoot!.querySelector('select')!.value).toBe('');
    await select('b');
    expect(form().name).toBe('Account B');
  });
  it('clears stale form drafts after JSON submission', async () => {
    await select('a');
    wizard.shadowRoot!.querySelector('form-mode-tabs')!.dispatchEvent(new CustomEvent('mode-change', { detail: { mode: 'json' } }));
    await settle();
    wizard.shadowRoot!.querySelector('json-import-editor')!.dispatchEvent(new CustomEvent('json-change', { detail: { value: JSON.stringify({ name: 'Imported', values: [] }) } }));
    await settle();
    save();
    wizard.open();
    await settle();
    expect(form().name).toBe('');
    expect(form().fields).toEqual([]);
  });
  it('does not recreate a saved draft when Escape is pressed while closed', async () => {
    await select('a');
    save();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    wizard.open();
    await settle();
    expect(form().name).toBe('');
  });
  it('preserves an unsaved draft when Escape closes the open dialog', async () => {
    await select('a');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    wizard.open();
    await settle();
    expect(form().name).toBe('Account A');
    expect(wizard.shadowRoot!.querySelector('select')!.value).toBe('');
  });
  it('blocks saving a value that has no selector and flags the row', async () => {
    await select('a');
    const list = form().shadowRoot!.querySelector<DynamicFieldList>('dynamic-field-list')!;
    await list.updateComplete;

    list.fields = [{ id: 'fa', name: 'User', selector: '', value: 'alice' }];
    list.dispatchEvent(new CustomEvent('fields-change', { detail: list.fields, bubbles: true, composed: true }));
    await settle();

    const submitted = vi.fn();
    wizard.addEventListener('data-submit', submitted);
    save();
    await settle();
    expect(submitted).not.toHaveBeenCalled();
    expect(wizard.shadowRoot!.querySelector('.form-error')).not.toBeNull();

    list.fields = [{ id: 'fa', name: 'User', selector: '#user', value: 'alice' }];
    list.dispatchEvent(new CustomEvent('fields-change', { detail: list.fields, bubbles: true, composed: true }));
    await settle();
    save();
    await settle();

    expect(submitted).toHaveBeenCalledOnce();
    expect(wizard.shadowRoot!.querySelector('.form-error')).toBeNull();
  });
  it('inherits a template type, persists an override and restores it for edit and copy', async () => {
    await templateStore.update('a', { fields: [{ id: 'fa', name: 'Password', selector: '#password', inputType: 'password' }] });
    await select('a');
    expect(form().fields[0].inputType).toBe('password');
    const list = form().shadowRoot!.querySelector<DynamicFieldList>('dynamic-field-list')!;
    await list.updateComplete;
    const selector = list.shadowRoot!.querySelector('select')!;
    selector.value = 'text';
    selector.dispatchEvent(new Event('change'));
    await settle();
    let persisted: ReturnType<typeof dataRecordStore.add> | undefined;
    wizard.addEventListener('data-submit', (event) => {
      persisted = dataRecordStore.add((event as CustomEvent).detail);
    }, { once: true });
    save();
    const record = (await persisted)!;
    await dataRecordStore.load();
    expect(dataRecordStore.getById(record.id)!.values[0].inputType).toBe('text');
    for (const mode of ['edit', 'copy'] as const) {
      wizard.mode = mode;
      wizard.open(dataRecordStore.getById(record.id)!);
      await settle();
      expect(form().fields[0].inputType).toBe('text');
      wizard.close();
    }
  });
});
