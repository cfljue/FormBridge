import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateId } from '@utils/id-generator';
import type { FieldInputType } from '@app-types/models';
import { I18nController } from '@i18n/index';
import { live } from 'lit/directives/live.js';

export interface FieldRow {
  id: string;
  name: string;
  selector?: string;
  value?: string;
  inputType?: FieldInputType;
}

@customElement('dynamic-field-list')
export class DynamicFieldList extends LitElement {
  static styles = css`
    :host { display: block; }
    .field-list { display: flex; flex-direction: column; gap: 8px; }
    .field-row { display: flex; gap: 8px; align-items: center; }
    .field-row input {
      flex: 1; min-width: 0; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-row input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    .field-row input.readonly { background: #f8fafc; color: #64748b; cursor: default; }
    .field-row.invalid input { border-color: #fca5a5; background: #fff7f7; }
    select { width: 86px; flex-shrink: 0; padding: 8px 4px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; color: #475569; }
    select:focus { outline: 2px solid #93c5fd; }
    .actions { display: flex; gap: 2px; flex-shrink: 0; }
    .row-btn {
      background: none; border: none; cursor: pointer; padding: 5px 7px; border-radius: 4px;
      font-size: 14px; color: #94a3b8; line-height: 1; transition: all 0.12s;
    }
    .row-btn:hover { background: #f1f5f9; color: #475569; }
    .row-btn.danger:hover { background: #fef2f2; color: #dc2626; }
    .add-btn {
      margin-top: 10px; padding: 7px; border: 2px dashed #e2e8f0; border-radius: 6px;
      background: none; cursor: pointer; font-size: 12px; color: #64748b; width: 100%;
      font-weight: 500; transition: all 0.12s;
    }
    .add-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .drag-handle { cursor: grab; color: #cbd5e1; user-select: none; font-size: 16px; flex-shrink: 0; }
    .drag-handle:active { cursor: grabbing; }
  `;

  @property({ type: Array }) fields: FieldRow[] = [];
  /** Row ids to flag as invalid, e.g. a value without a selector. */
  @property({ type: Array }) invalidIds: string[] = [];
  @property({ type: String }) mode: 'definition' | 'value' = 'definition';
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) showDrag = false;
  private _i18n = new I18nController(this);

  private _notify() {
    this.dispatchEvent(new CustomEvent('fields-change', { detail: [...this.fields], bubbles: true, composed: true }));
  }

  private _updateField(id: string, key: 'name' | 'selector' | 'value', val: string) {
    this.fields = this.fields.map((f) => (f.id === id ? { ...f, [key]: val } : f));
    this._notify();
  }

  private _updateInputType(id: string, event: Event) {
    const inputType: FieldInputType = (event.target as HTMLSelectElement).value === 'password' ? 'password' : 'text';
    this.fields = this.fields.map((field) => field.id === id ? { ...field, inputType } : field);
    this._notify();
  }

  addRow() {
    this.fields = [...this.fields, { id: generateId(), name: '', selector: '', value: '' }];
    this._notify();
  }

  copyRow(id: string) {
    const idx = this.fields.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const src = this.fields[idx];
    const copy = { ...src, id: generateId(), name: src.name + ' (copy)' };
    const updated = [...this.fields];
    updated.splice(idx + 1, 0, copy);
    this.fields = updated;
    this._notify();
  }

  deleteRow(id: string) {
    this.fields = this.fields.filter((f) => f.id !== id);
    this._notify();
  }

  private _onDragStart(e: DragEvent, index: number) {
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', String(index));
  }
  private _onDragOver(e: DragEvent) { e.preventDefault(); e.dataTransfer!.dropEffect = 'move'; }
  private _onDrop(e: DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer!.getData('text/plain'));
    if (isNaN(fromIndex) || fromIndex === toIndex) return;
    const updated = [...this.fields];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    this.fields = updated;
    this._notify();
  }

  render() {
    const isDef = this.mode === 'definition';
    const isValue = this.mode === 'value';

    return html`
      <div class="field-list">
        ${this.fields.map((f, i) => html`
          <div class="field-row ${this.invalidIds.includes(f.id) ? 'invalid' : ''}">
            ${this.showDrag
              ? html`<span class="drag-handle" draggable="true" @dragstart=${(e: DragEvent) => this._onDragStart(e, i)} @dragover=${this._onDragOver} @drop=${(e: DragEvent) => this._onDrop(e, i)}>&#x2630;</span>`
              : ''}
            ${isDef ? html`
              <input placeholder=${this._i18n.t('template.fieldName')} .value=${f.name} @input=${(e: Event) => this._updateField(f.id, 'name', (e.target as HTMLInputElement).value)} ?readonly=${this.readonly} />
              <input placeholder=${this._i18n.t('template.fieldSelector')} .value=${f.selector ?? ''} @input=${(e: Event) => this._updateField(f.id, 'selector', (e.target as HTMLInputElement).value)} ?readonly=${this.readonly} />
            ` : ''}
            ${isValue ? html`
              <input placeholder=${this._i18n.t('template.fieldName')} .value=${f.name} @input=${(e: Event) => this._updateField(f.id, 'name', (e.target as HTMLInputElement).value)} ?readonly=${this.readonly} />
              <input placeholder=${this._i18n.t('template.fieldSelector')} .value=${f.selector ?? ''} @input=${(e: Event) => this._updateField(f.id, 'selector', (e.target as HTMLInputElement).value)} ?readonly=${this.readonly} />
              <input placeholder=${this._i18n.t('template.fieldValue')} type=${f.inputType === 'password' ? 'password' : 'text'} autocomplete="off" .value=${f.value ?? ''} @input=${(e: Event) => this._updateField(f.id, 'value', (e.target as HTMLInputElement).value)} ?readonly=${this.readonly} />
            ` : ''}
            <select aria-label=${this._i18n.t('field.inputType')} title=${this._i18n.t('field.inputType')} @change=${(e: Event) => this._updateInputType(f.id, e)} ?disabled=${this.readonly}>
              <option value="text" .selected=${live(f.inputType !== 'password')}>${this._i18n.t('field.text')}</option>
              <option value="password" .selected=${live(f.inputType === 'password')}>${this._i18n.t('field.password')}</option>
            </select>
            <div class="actions">
              <button class="row-btn" @click=${() => this.copyRow(f.id)} title=${this._i18n.t('config.copy')}>&#x1F4CB;</button>
              <button class="row-btn danger" @click=${() => this.deleteRow(f.id)} title=${this._i18n.t('config.delete')}>&times;</button>
            </div>
          </div>
        `)}
      </div>
      <button class="add-btn" @click=${() => this.addRow()} ?disabled=${this.readonly}>${this._i18n.t('template.addField')}</button>
    `;
  }
}
