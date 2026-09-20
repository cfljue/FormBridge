import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { type FieldRow } from './dynamic-field-list';
import './dynamic-field-list';

export interface FormConfigData {
  name: string;
  description: string;
  url: string;
  fields: FieldRow[];
  buttonName: string;
  buttonSelector: string;
}

type TextFieldKey = 'name' | 'description' | 'url' | 'buttonName' | 'buttonSelector';

@customElement('form-config')
export class FormConfig extends LitElement {
  static styles = css`
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    label { font-size: 12px; font-weight: 600; color: #475569; }
    input, textarea {
      padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus, textarea:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    textarea { resize: vertical; min-height: 64px; }
    .row { display: flex; gap: 12px; }
    .row > * { flex: 1; }
    .section-title {
      font-size: 12px; font-weight: 600; color: #475569;
      padding-top: 16px; border-top: 1px solid #f1f5f9;
    }
    .field-label-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 600; color: #475569;
      padding-top: 16px; border-top: 1px solid #f1f5f9;
    }
    .field-label-row span:last-child { color: #94a3b8; font-weight: 400; }
  `;

  private _i18n = new I18nController(this);

  @property({ type: String }) mode: 'definition' | 'value' = 'definition';
  @property({ type: String }) name = '';
  @property({ type: String }) description = '';
  @property({ type: String }) url = '';
  @property({ type: Array }) fields: FieldRow[] = [];
  /** Field ids to flag as invalid, forwarded to the list for row highlighting. */
  @property({ type: Array }) invalidFieldIds: string[] = [];
  @property({ type: String }) buttonName = '';
  @property({ type: String }) buttonSelector = '';

  private _notify() {
    this.dispatchEvent(new CustomEvent('form-change', {
      detail: {
        name: this.name,
        description: this.description,
        url: this.url,
        fields: [...this.fields],
        buttonName: this.buttonName,
        buttonSelector: this.buttonSelector,
      } as FormConfigData,
      bubbles: true, composed: true,
    }));
  }

  private _onInput(field: TextFieldKey, e: Event) {
    this[field] = (e.target as HTMLInputElement).value;
    this._notify();
  }

  private _onFieldsChange(e: CustomEvent) {
    this.fields = e.detail as FieldRow[];
    this._notify();
  }

  render() {
    const isDef = this.mode === 'definition';

    return html`
      <div class="form">
        <div class="row">
          <div class="form-group">
            <label>${this._i18n.t('template.nameRequired')}</label>
            <input .value=${this.name} @input=${(e: Event) => this._onInput('name', e)} />
          </div>
          <div class="form-group">
            <label>${this._i18n.t('template.url')}</label>
            <input .value=${this.url} @input=${(e: Event) => this._onInput('url', e)} />
          </div>
        </div>

        <div class="form-group">
          <label>${this._i18n.t('template.description')}</label>
          <textarea .value=${this.description} @input=${(e: Event) => this._onInput('description', e)}></textarea>
        </div>

        <div class="section-title">
          ${isDef ? this._i18n.t('template.formFields') : this._i18n.t('data.fields')}
        </div>
        <dynamic-field-list
          mode=${this.mode}
          .fields=${this.fields}
          .invalidIds=${this.invalidFieldIds}
          @fields-change=${this._onFieldsChange}
        ></dynamic-field-list>

        <div class="section-title">${this._i18n.t('template.buttonConfig')}</div>
        <div class="row">
          <div class="form-group">
            <label>${this._i18n.t('template.buttonName')}</label>
            <input .value=${this.buttonName} @input=${(e: Event) => this._onInput('buttonName', e)} />
          </div>
          <div class="form-group">
            <label>${this._i18n.t('template.buttonSelector')}</label>
            <input .value=${this.buttonSelector} @input=${(e: Event) => this._onInput('buttonSelector', e)} />
          </div>
        </div>
      </div>
    `;
  }
}
