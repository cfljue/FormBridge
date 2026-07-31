import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { StoreController } from '@store/store-controller';
import { templateStore } from '@store/template-store';
import { type DataRecord, type DataFieldValue, type Template } from '@app-types/models';
import { type FormConfigData } from '@shared/form-config';
import { type FormInputMode } from '@shared/form-mode-tabs';
import { parseDataRecordJson } from '@utils/direct-json-import';
import '@shared/form-config';
import '@shared/form-mode-tabs';
import '@shared/json-import-editor';
import '@shared/modal-dialog';

let _dataDraft: (FormConfigData & { templateId: string }) | null = null;

@customElement('data-wizard')
export class DataWizard extends LitElement {
  static styles = css`
    .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
    label { font-size: 12px; font-weight: 600; color: #475569; }
    select {
      padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    select:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    .btn-primary {
      padding: 8px 20px; border-radius: 6px; background: #2563eb; color: #fff;
      border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-cancel {
      padding: 8px 20px; border-radius: 6px; background: #fff; color: #475569;
      border: 1px solid #e2e8f0; cursor: pointer; font-size: 13px; transition: background 0.15s;
    }
    .btn-cancel:hover { background: #f1f5f9; }
  `;

  private _i18n = new I18nController(this);
  @property({ type: String }) mode: 'add' | 'edit' | 'copy' = 'add';

  private _templates = new StoreController(this, templateStore, true);
  private _selectedTemplateId = '';
  private _restoring = false;
  private _formData: FormConfigData = { name: '', description: '', url: '', fields: [], buttonName: '', buttonSelector: '' };
  private _inputMode: FormInputMode = 'form';
  private _jsonText = '';
  private _jsonError = '';
  private _jsonDirty = false;

  open(record?: DataRecord) {
    this._selectedTemplateId = '';
    if (record) {
      this._selectedTemplateId = record.templateId;
      const tmpl = templateStore.getById(record.templateId);
      this._formData = {
        name: record.name,
        description: record.description || tmpl?.description || '',
        url: record.url,
        fields: this._buildValueFields(record.templateId, record.values),
        buttonName: record.buttonName ?? '',
        buttonSelector: record.buttonSelector ?? '',
      };
    } else if (_dataDraft) {
      this._restoring = true;
      this._selectedTemplateId = _dataDraft.templateId;
      this._formData = {
        name: _dataDraft.name,
        description: _dataDraft.description,
        url: _dataDraft.url,
        fields: [..._dataDraft.fields],
        buttonName: _dataDraft.buttonName,
        buttonSelector: _dataDraft.buttonSelector,
      };
    } else {
      this._formData = { name: '', description: '', url: '', fields: [], buttonName: '', buttonSelector: '' };
    }
    this._inputMode = 'form';
    this._jsonText = this._serializeFormData();
    this._jsonError = '';
    this._jsonDirty = false;
    this.requestUpdate();
    const modal = this.renderRoot.querySelector('#modal') as HTMLElement & { open: boolean };
    if (modal) modal.open = true;
  }

  updated(_changedProperties: Map<string, unknown>) {
    super.updated(_changedProperties);
    this._restoring = false;
  }

  private _buildValueFields(templateId: string, values: DataFieldValue[]) {
    // Migrate legacy format: Record<string, string> → DataFieldValue[]
    const vArr: DataFieldValue[] = Array.isArray(values)
      ? values
      : Object.entries(values as unknown as Record<string, string>).map(([name, value]) => ({ name, selector: '', value }));

    const tmpl = templateStore.getById(templateId);
    if (!tmpl) return vArr.map((v) => ({ id: crypto.randomUUID(), ...v }));
    return tmpl.fields.map((f) => {
      const saved = vArr.find((v) => v.name === f.name) ?? vArr.find((v) => v.selector === f.selector);
      return { id: f.id, name: f.name, selector: f.selector, value: saved?.value ?? '' };
    });
  }

  close() {
    if (this.mode === 'add') this._saveDraft();
    const modal = this.renderRoot.querySelector('#modal') as HTMLElement & { open: boolean };
    if (modal) modal.open = false;
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  private _onTemplateChange(e: Event) {
    if (this._restoring) return;
    const id = (e.target as HTMLSelectElement).value;
    this._selectedTemplateId = id;
    if (!id) {
      this._formData = { name: '', description: '', url: '', fields: [], buttonName: '', buttonSelector: '' };
      this.requestUpdate();
      return;
    }
    const tmpl = templateStore.getById(id);
    if (tmpl) {
      this._formData = {
        name: this._formData.name || tmpl.name,
        description: tmpl.description,
        url: this._formData.url || tmpl.url,
        fields: tmpl.fields.map((f) => ({ id: f.id, name: f.name, selector: f.selector, value: '' })),
        buttonName: this._formData.buttonName || tmpl.button?.name || '',
        buttonSelector: this._formData.buttonSelector || tmpl.button?.selector || '',
      };
      this.requestUpdate();
    }
  }

  private _onFormChange(e: CustomEvent) {
    this._formData = e.detail as FormConfigData;
    this.requestUpdate();
  }

  private _serializeFormData() {
    const d = this._formData;
    return JSON.stringify([{
      name: d.name,
      description: d.description,
      url: d.url,
      templateId: this._selectedTemplateId,
      values: d.fields.map((field) => ({
        name: field.name,
        selector: field.selector ?? '',
        value: field.value ?? '',
      })),
      ...(d.buttonName ? { buttonName: d.buttonName } : {}),
      ...(d.buttonSelector ? { buttonSelector: d.buttonSelector } : {}),
    }], null, 2);
  }

  private _onModeChange(event: CustomEvent<{ mode: FormInputMode }>) {
    this._inputMode = event.detail.mode;
    if (this._inputMode === 'json' && !this._jsonDirty) this._jsonText = this._serializeFormData();
    this._jsonError = '';
    this.requestUpdate();
  }

  private _onJsonChange(event: CustomEvent<{ value: string }>) {
    this._jsonText = event.detail.value;
    this._jsonError = '';
    this._jsonDirty = true;
    this.requestUpdate();
  }

  private _saveDraft() {
    _dataDraft = { ...this._formData, fields: [...this._formData.fields], templateId: this._selectedTemplateId };
  }

  private _submit() {
    if (this._inputMode === 'json') {
      try {
        const detail = parseDataRecordJson(this._jsonText);
        this.dispatchEvent(new CustomEvent('data-submit', {
          detail, bubbles: true, composed: true,
        }));
        this._clearDraft();
        this.close();
      } catch {
        this._jsonError = this._i18n.t('config.jsonInvalid');
        this.requestUpdate();
      }
      return;
    }
    const d = this._formData;
    if (!d.name.trim()) return;
    const values: DataFieldValue[] = d.fields
      .map((f) => ({ name: f.name, selector: f.selector ?? '', value: (f.value ?? '').trim() }));
    this.dispatchEvent(new CustomEvent('data-submit', {
      detail: {
        name: d.name.trim(), description: d.description.trim(), url: d.url.trim(),
        templateId: this._selectedTemplateId,
        values,
        buttonName: d.buttonName.trim() || undefined,
        buttonSelector: d.buttonSelector.trim() || undefined,
      },
      bubbles: true, composed: true,
    }));
    this._clearDraft();
    this.close();
  }

  private _clearDraft() {
    _dataDraft = null;
  }

  render() {
    const templates = this._templates.state;
    const title = this.mode === 'edit' ? this._i18n.t('data.edit') : this.mode === 'copy' ? this._i18n.t('data.copy') : this._i18n.t('data.new');

    return html`
      <modal-dialog id="modal" title=${title} size="large" @modal-close=${this.close}>
        <form-mode-tabs
          .active=${this._inputMode}
          .formLabel=${this._i18n.t('config.modeForm')}
          .jsonLabel=${this._i18n.t('config.modeJson')}
          @mode-change=${this._onModeChange}
        ></form-mode-tabs>
        ${this._inputMode === 'form' ? html`
          <div class="form-group">
            <label>${this._i18n.t('data.selectTemplate')}</label>
            <select @change=${this._onTemplateChange}>
              <option value="" ?selected=${!this._selectedTemplateId}>${this._i18n.t('data.manual')}</option>
              ${templates.map((t) => html`<option value=${t.id} ?selected=${this._selectedTemplateId === t.id}>${t.name}</option>`)}
            </select>
          </div>

          <form-config
            mode="value"
            .name=${this._formData.name}
            .description=${this._formData.description}
            .url=${this._formData.url}
            .fields=${this._formData.fields}
            .buttonName=${this._formData.buttonName}
            .buttonSelector=${this._formData.buttonSelector}
            @form-change=${this._onFormChange}
          ></form-config>
        ` : html`
          <json-import-editor
            .label=${this._i18n.t('config.jsonLabel')}
            .hint=${this._i18n.t('config.jsonHint')}
            .placeholder=${this._i18n.t('config.jsonDataPlaceholder')}
            .value=${this._jsonText}
            .error=${this._jsonError}
            @json-change=${this._onJsonChange}
          ></json-import-editor>
        `}

        <div slot="footer" style="margin-top:16px">
          <button class="btn-cancel" @click=${this.close}>${this._i18n.t('config.cancel')}</button>
          <button class="btn-primary" @click=${this._submit} ?disabled=${this._inputMode === 'form' ? !this._formData.name.trim() : !this._jsonText.trim()}>${this._i18n.t('config.save')}</button>
        </div>
      </modal-dialog>
    `;
  }
}
