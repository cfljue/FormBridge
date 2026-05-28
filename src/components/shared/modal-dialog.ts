import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('modal-dialog')
export class ModalDialog extends LitElement {
  static styles = css`
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      padding: 24px;
      animation: fadeIn 0.15s ease;
    }
    .dialog {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      width: 100%;
      max-height: 85vh;
      display: flex; flex-direction: column;
      animation: slideUp 0.2s ease;
    }
    .dialog.small { max-width: 420px; }
    .dialog.medium { max-width: 560px; }
    .dialog.large { max-width: 720px; }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 24px; border-bottom: 1px solid #e2e8f0;
    }
    .title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
    .close-btn {
      background: none; border: none; font-size: 22px; cursor: pointer;
      color: #94a3b8; padding: 0; line-height: 1; width: 28px; height: 28px;
      border-radius: 6px; display: flex; align-items: center; justify-content: center;
    }
    .close-btn:hover { background: #f1f5f9; color: #475569; }
    .body { padding: 24px; overflow-y: auto; flex: 1; }
    .footer {
      padding: 14px 24px; border-top: 1px solid #e2e8f0;
      display: flex; justify-content: flex-end; gap: 8px;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '';
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeyDown);
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay">
        <div class="dialog ${this.size}">
          <div class="header">
            <h3 class="title">${this.title}</h3>
            <button class="close-btn" @click=${() => this.close()}>&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }
}
