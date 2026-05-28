import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { StoreController } from '@store/store-controller';
import { settingsStore } from '@store/settings-store';

@customElement('cookie-settings')
export class CookieSettings extends LitElement {
  static styles = css`
    :host { display: block; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 12px;
    }

    .toggle-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
      margin-bottom: 16px;
    }
    .toggle-label { font-size: 14px; font-weight: 500; color: #1e293b; }
    .toggle-desc { font-size: 12px; color: #64748b; margin-top: 2px; }

    .switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; inset: 0; background: #cbd5e1;
      border-radius: 22px; cursor: pointer; transition: background 0.2s;
    }
    .slider::before {
      content: ''; position: absolute;
      height: 16px; width: 16px; left: 3px; top: 3px;
      background: #fff; border-radius: 50%;
      transition: transform 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
    input:checked + .slider { background: #22c55e; }
    input:checked + .slider::before { transform: translateX(18px); }

    .disclaimer {
      background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;
      padding: 14px 16px;
    }
    .disclaimer h4 {
      font-size: 13px; font-weight: 600; color: #92400e; margin: 0 0 8px;
    }
    .disclaimer ul {
      margin: 0; padding: 0 0 0 18px;
      font-size: 12px; color: #78350f; line-height: 1.7;
    }
    .disclaimer li { margin-bottom: 2px; }

    .kb-box {
      background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
      padding: 14px 16px; margin-bottom: 16px;
    }
    .kb-box h4 {
      font-size: 13px; font-weight: 600; color: #166534; margin: 0 0 10px;
    }
    .kb-row {
      display: flex; align-items: center; gap: 12px; margin-bottom: 6px;
      font-size: 13px; color: #14532d;
    }
    .kb-key {
      display: inline-flex; align-items: center; gap: 4px;
      background: #fff; border: 1px solid #d1d5db; border-radius: 4px;
      padding: 2px 8px; font-size: 12px; font-weight: 600;
      color: #374151; white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
      box-shadow: 0 1px 0 rgba(0,0,0,0.08);
      min-width: 60px; justify-content: center;
    }
    .kb-desc { color: #166534; }
  `;

  private _i18n = new I18nController(this);
  private _settings = new StoreController(this, settingsStore);

  connectedCallback() {
    super.connectedCallback();
    this._settings.load();
  }

  private _toggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    settingsStore.setCookieCopyEnabled(checked);
  }

  render() {
    const enabled = this._settings.state.cookieCopyEnabled;
    return html`
      <div class="section">
        <h3 class="section-title">${this._i18n.t('cookie.title')}</h3>

        <div class="toggle-row">
          <label class="switch">
            <input type="checkbox" .checked=${enabled} @change=${this._toggle} />
            <span class="slider"></span>
          </label>
          <div>
            <div class="toggle-label">${this._i18n.t('cookie.enable')}</div>
            <div class="toggle-desc">${this._i18n.t('cookie.enableDesc')}</div>
          </div>
        </div>

        <div class="kb-box">
          <h4>${this._i18n.t('cookie.howtoTitle')}</h4>
          <div class="kb-row">
            <span class="kb-key">Ctrl + C</span>
            <span class="kb-desc">${this._i18n.t('cookie.howtoCopy')}</span>
          </div>
          <div class="kb-row">
            <span class="kb-key">Ctrl + V</span>
            <span class="kb-desc">${this._i18n.t('cookie.howtoPaste')}</span>
          </div>
          <div class="kb-row">
            <span class="kb-key">Ctrl + D</span>
            <span class="kb-desc">${this._i18n.t('cookie.howtoClear')}</span>
          </div>
        </div>

        <div class="disclaimer">
          <h4>${this._i18n.t('cookie.disclaimerTitle')}</h4>
          <ul>
            <li>${this._i18n.t('cookie.disclaimer1')}</li>
            <li>${this._i18n.t('cookie.disclaimer2')}</li>
            <li>${this._i18n.t('cookie.disclaimer3')}</li>
            <li>${this._i18n.t('cookie.disclaimer4')}</li>
          </ul>
        </div>
      </div>
    `;
  }
}
