import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('tabs-nav')
export class TabsNav extends LitElement {
  static styles = css`
    :host {
      display: flex; align-items: center; gap: 0; flex-shrink: 0;
      background: #f8fafc; border-bottom: 1px solid #e2e8f0;
      padding: 0 24px;
    }
    .brand {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 700; color: #0f172a;
      margin-right: 24px; white-space: nowrap;
    }
    .logo-icon {
      width: 24px; height: 24px; background: #2563eb; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 13px;
    }
    .tabs {
      display: flex; align-items: center;
    }
    .tabs button {
      padding: 14px 20px; border: none; background: none; cursor: pointer;
      font-size: 13px; font-weight: 500; color: #64748b;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: color 0.15s, border-color 0.15s;
    }
    .tabs button:hover { color: #1e293b; }
    .tabs button.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }

    .spacer { flex: 1; }
    .right-actions {
      display: flex; align-items: center; gap: 8px;
    }
    .guide-btn {
      padding: 5px 14px; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #64748b;
      transition: all 0.15s; white-space: nowrap;
    }
    .guide-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .guide-btn.active { border-color: #2563eb; color: #2563eb; background: #eff6ff; font-weight: 600; }
    .lang-btn {
      padding: 5px 14px; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s; white-space: nowrap;
    }
    .lang-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
  `;

  private _i18n = new I18nController(this);
  @property({ type: String }) active = 'data';

  private _select(tab: string) {
    this.active = tab;
    this.dispatchEvent(new CustomEvent('tab-change', { detail: tab, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="brand">
        <span class="logo-icon">&#x25C6;</span>
        ${this._i18n.t('config.title')}
      </div>
      <div class="tabs">
        <button class=${this.active === 'data' ? 'active' : ''} @click=${() => this._select('data')}>${this._i18n.t('config.tabData')}</button>
        <button class=${this.active === 'template' ? 'active' : ''} @click=${() => this._select('template')}>${this._i18n.t('config.tabTemplates')}</button>
        <button class=${this.active === 'cookie' ? 'active' : ''} @click=${() => this._select('cookie')}>${this._i18n.t('config.tabCookie')}</button>
      </div>
      <div class="spacer"></div>
      <div class="right-actions">
        <button class="guide-btn ${this.active === 'guide' ? 'active' : ''}" @click=${() => this._select('guide')}>${this._i18n.t('config.tabGuide')}</button>
        <button class="lang-btn" @click=${() => this.dispatchEvent(new CustomEvent('toggle-lang', { bubbles: true, composed: true }))}>${this._i18n.t('lang.switch')}</button>
      </div>
    `;
  }
}
