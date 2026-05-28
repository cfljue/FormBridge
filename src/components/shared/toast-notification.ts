import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastInstance: ToastNotification | null = null;
let nextId = 0;

export function showToast(message: string, type: ToastItem['type'] = 'info', duration = 3000) {
  toastInstance?._add(message, type, duration);
}

@customElement('toast-notification')
export class ToastNotification extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 16px;
      right: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 6px;
      pointer-events: none;
    }
    .toast {
      padding: 10px 14px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      pointer-events: auto;
      animation: slideDown 0.25s ease;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
    .toast.error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
    .toast.info    { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
    .toast.warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
    .msg { flex: 1; }
    .close {
      cursor: pointer; background: none; border: none;
      font-size: 16px; line-height: 1; padding: 0;
      color: inherit; opacity: 0.45; flex-shrink: 0; margin-top: 1px;
    }
    .close:hover { opacity: 0.8; }
    @keyframes slideDown {
      from { transform: translateY(-12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  @state() private _toasts: ToastItem[] = [];
  private _timers = new Map<number, ReturnType<typeof setTimeout>>();

  connectedCallback() { super.connectedCallback(); toastInstance = this; }
  disconnectedCallback() { super.disconnectedCallback(); toastInstance = null; }

  _add(message: string, type: ToastItem['type'], duration: number) {
    const id = nextId++;
    this._toasts = [...this._toasts.slice(-3), { id, message, type }];
    if (this._toasts.length > 4) this._toasts = this._toasts.slice(-4);
    const timer = setTimeout(() => this._remove(id), duration);
    this._timers.set(id, timer);
    this.requestUpdate();
  }

  _remove(id: number) {
    this._toasts = this._toasts.filter((t) => t.id !== id);
    const t = this._timers.get(id);
    if (t) { clearTimeout(t); this._timers.delete(id); }
    this.requestUpdate();
  }

  private _onEnter(id: number) {
    const t = this._timers.get(id);
    if (t) { clearTimeout(t); this._timers.delete(id); }
  }

  private _onLeave(id: number) {
    const timer = setTimeout(() => this._remove(id), 1500);
    this._timers.set(id, timer);
  }

  render() {
    return this._toasts.map(
      (t) => html`
        <div class="toast ${t.type}" @mouseenter=${() => this._onEnter(t.id)} @mouseleave=${() => this._onLeave(t.id)}>
          <span class="msg">${t.message}</span>
          <button class="close" @click=${() => this._remove(t.id)}>&times;</button>
        </div>
      `
    );
  }
}
