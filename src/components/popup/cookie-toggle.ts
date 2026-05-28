import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('cookie-toggle')
export class CookieToggle extends LitElement {
  static styles = css`
    :host { display: flex; align-items: center; gap: 8px; }
    .label { font-size: 12px; color: #64748b; white-space: nowrap; user-select: none; }
    .switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; inset: 0;
      background: #cbd5e1;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .slider::before {
      content: '';
      position: absolute;
      height: 14px; width: 14px;
      left: 3px; top: 3px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
    input:checked + .slider { background: #22c55e; }
    input:checked + .slider::before { transform: translateX(16px); }
  `;

  private _i18n = new I18nController(this);

  @property({ type: Boolean }) checked = false;

  private _toggle(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new CustomEvent('toggle-change', { detail: this.checked, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label class="switch">
        <input type="checkbox" .checked=${this.checked} @change=${this._toggle} />
        <span class="slider"></span>
      </label>
      <span class="label">${this._i18n.t('popup.cookieCopy')}</span>
    `;
  }
}
