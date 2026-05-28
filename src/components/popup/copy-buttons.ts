import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('copy-buttons')
export class CopyButtons extends LitElement {
  static styles = css`
    :host { display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
    button {
      width: 28px; height: 28px;
      border-radius: 5px; font-size: 12px; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.12s;
      display: flex; align-items: center; justify-content: center;
    }
    button:hover:not(:disabled) { background: #f8fafc; }
    button:disabled { opacity: 0.3; cursor: not-allowed; }
    .btn-c:hover:not(:disabled) { border-color: #2563eb; color: #2563eb; }
    .btn-v:hover:not(:disabled) { border-color: #16a34a; color: #16a34a; }
    .dot {
      width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
      margin: 0 2px;
    }
    .dot.on { background: #22c55e; }
    .dot.off { background: #e2e8f0; }
  `;

  @property({ type: Boolean }) enabled = false;
  @property({ type: Boolean }) hasSnapshot = false;

  private _copy() {
    this.dispatchEvent(new CustomEvent('copy-cookies', { bubbles: true, composed: true }));
  }
  private _paste() {
    this.dispatchEvent(new CustomEvent('paste-cookies', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <span class="dot ${this.enabled ? 'on' : 'off'}" title=${this.enabled ? 'Cookie copy enabled' : 'Cookie copy disabled'}></span>
      <button class="btn-c" @click=${this._copy} ?disabled=${!this.enabled} title="Copy (Ctrl+C)">&#x1F4E5;</button>
      <button class="btn-v" @click=${this._paste} ?disabled=${!this.enabled || !this.hasSnapshot} title="Paste (Ctrl+V)">&#x1F4E4;</button>
    `;
  }
}
