import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('batch-toolbar')
export class BatchToolbar extends LitElement {
  static styles = css`
    :host { display: flex; align-items: center; gap: 8px; }
    .count { font-size: 12px; color: #64748b; }
    button {
      padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
      cursor: pointer; border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s;
    }
    button:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
    button:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-delete:hover:not(:disabled) { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
  `;

  private _i18n = new I18nController(this);

  @property({ type: Number }) selectedCount = 0;
  @property({ type: Boolean }) showImport = true;
  @property({ type: Boolean }) showExport = true;
  @property({ type: Boolean }) showDelete = true;

  private _triggerImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.dispatchEvent(new CustomEvent('batch-import', { detail: { content: reader.result as string }, bubbles: true, composed: true }));
      };
      reader.readAsText(file);
    };
    input.click();
  }

  private _triggerExport() {
    this.dispatchEvent(new CustomEvent('batch-export', { bubbles: true, composed: true }));
  }

  private _triggerDelete() {
    this.dispatchEvent(new CustomEvent('batch-delete', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      ${this.showImport ? html`<button @click=${this._triggerImport}>${this._i18n.t('config.import')}</button>` : ''}
      ${this.showExport ? html`<button @click=${this._triggerExport} ?disabled=${this.selectedCount === 0}>${this._i18n.t('config.export')}</button>` : ''}
      ${this.showDelete ? html`<button class="btn-delete" @click=${this._triggerDelete} ?disabled=${this.selectedCount === 0}>${this._i18n.t('config.delete')}</button>` : ''}
      ${this.selectedCount > 0 ? html`<span class="count">${this._i18n.t('config.selected', { count: this.selectedCount })}</span>` : ''}
    `;
  }
}
