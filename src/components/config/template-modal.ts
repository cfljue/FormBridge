import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { type Template, type TemplateField } from '@app-types/models';
import { type FormConfigData } from '@shared/form-config';
import { type FormInputMode } from '@shared/form-mode-tabs';
import { parseTemplateJson } from '@utils/direct-json-import';
import '@shared/form-config';
import '@shared/form-mode-tabs';
import '@shared/json-import-editor';
import '@shared/skill-prompt-card';
import '@shared/modal-dialog';

let _templateDraft: FormConfigData | null = null;

@customElement('template-modal')
export class TemplateModal extends LitElement {
  static styles = css`
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

  @property({ type: String }) mode: 'add' | 'edit' | 'copy' | 'extract' = 'add';
  @property({ type: Object }) data: Partial<Template> = {};

  private _formData: FormConfigData = { name: '', description: '', url: '', fields: [], buttonName: '', buttonSelector: '' };
  private _inputMode: FormInputMode = 'form';
  private _jsonText = '';
  private _jsonError = '';
  private _jsonDirty = false;
  private _isOpen = false;

  open(template?: Template) {
    this._isOpen = true;
    if (template) {
      this.data = { ...template };
      this._formData = {
        name: template.name,
        description: template.description,
        url: template.url,
        fields: template.fields.map((f) => ({ ...f, value: '' })),
        buttonName: template.button?.name ?? '',
        buttonSelector: template.button?.selector ?? '',
      };
    } else if (_templateDraft) {
      this._formData = { ..._templateDraft, fields: [..._templateDraft.fields] };
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

  close() {
    // A hidden dialog also receives Escape; do not recreate a draft that was already submitted.
    if (!this._isOpen) return;
    this._isOpen = false;
    if (this.mode === 'add') this._saveDraft();
    const modal = this.renderRoot.querySelector('#modal') as HTMLElement & { open: boolean };
    if (modal) modal.open = false;
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
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
      fields: d.fields.map((field) => ({ name: field.name, selector: field.selector ?? '', inputType: field.inputType })),
      ...(d.buttonSelector.trim() ? { button: { name: d.buttonName || 'Submit', selector: d.buttonSelector } } : {}),
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

  private _submit() {
    if (this._inputMode === 'json') {
      try {
        const detail = parseTemplateJson(this._jsonText);
        this.dispatchEvent(new CustomEvent('template-submit', {
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
    const fields: TemplateField[] = d.fields
      .filter((f) => f.name.trim())
      .map((f) => ({ id: f.id, name: f.name.trim(), selector: f.selector?.trim() ?? '', inputType: f.inputType }));
    const button = d.buttonSelector.trim() ? { name: d.buttonName.trim() || 'Submit', selector: d.buttonSelector.trim() } : undefined;
    this.dispatchEvent(new CustomEvent('template-submit', {
      detail: { name: d.name.trim(), description: d.description.trim(), url: d.url.trim(), fields, button },
      bubbles: true, composed: true,
    }));
    this._clearDraft();
    this.close();
  }

  private _saveDraft() {
    _templateDraft = { ...this._formData, fields: [...this._formData.fields] };
  }

  private _clearDraft() {
    _templateDraft = null;
  }

  render() {
    const title = this.mode === 'edit' ? this._i18n.t('template.edit') : this.mode === 'copy' ? this._i18n.t('template.copy') : this.mode === 'extract' ? this._i18n.t('template.extract') : this._i18n.t('template.new');
    return html`
      <modal-dialog id="modal" title=${title} size="large" @modal-close=${this.close}>
        <form-mode-tabs
          .active=${this._inputMode}
          .formLabel=${this._i18n.t('config.modeForm')}
          .jsonLabel=${this._i18n.t('config.modeJson')}
          @mode-change=${this._onModeChange}
        ></form-mode-tabs>
        ${this.mode === 'add' ? html`
          <skill-prompt-card
            .title=${this._i18n.t('config.skillPromptTitle')}
            .description=${this._i18n.t('config.skillPrompt')}
            .prompt=${this._i18n.t('config.skillPrompt')}
            .copyLabel=${this._i18n.t('config.skillPromptCopy')}
            .copiedLabel=${this._i18n.t('config.skillPromptCopied')}
            .failedLabel=${this._i18n.t('config.skillPromptCopyFailed')}
          ></skill-prompt-card>
        ` : null}
        ${this._inputMode === 'form' ? html`
          <form-config
            mode="definition"
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
            .placeholder=${this._i18n.t('config.jsonTemplatePlaceholder')}
            .value=${this._jsonText}
            .error=${this._jsonError}
            @json-change=${this._onJsonChange}
          ></json-import-editor>
        `}
        <div slot="footer">
          <button class="btn-cancel" @click=${this.close}>${this._i18n.t('config.cancel')}</button>
          <button class="btn-primary" @click=${this._submit} ?disabled=${this._inputMode === 'form' ? !this._formData.name.trim() : !this._jsonText.trim()}>${this._i18n.t('config.save')}</button>
        </div>
      </modal-dialog>
    `;
  }
}
