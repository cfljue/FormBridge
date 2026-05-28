import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('confirm-dialog')
export class ConfirmDialog extends LitElement {
  static styles = css`
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4);
      z-index: 11000; display: flex; align-items: center; justify-content: center;
    }
    .dialog {
      background: #fff; border-radius: 12px; padding: 24px;
      max-width: 400px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .title { font-size: 16px; font-weight: 700; margin: 0 0 8px; color: #1e293b; }
    .message { color: #64748b; font-size: 13px; margin-bottom: 24px; line-height: 1.5; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; }
    button {
      padding: 8px 18px; border-radius: 6px; font-size: 13px; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s;
    }
    button:hover { background: #f1f5f9; }
    .btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
    .btn-danger:hover { background: #b91c1c; border-color: #b91c1c; }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = 'Confirm';
  @property({ type: String }) message = 'Are you sure?';
  @property({ type: String }) confirmLabel = 'Delete';
  @property({ type: String }) cancelLabel = 'Cancel';

  confirm() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
  }
  cancel() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay" @click=${this.cancel}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <h3 class="title">${this.title}</h3>
          <p class="message">${this.message}</p>
          <div class="actions">
            <button @click=${this.cancel}>${this.cancelLabel}</button>
            <button class="btn-danger" @click=${this.confirm}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }
}
