import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('guide-page')
export class GuidePage extends LitElement {
  static styles = css`
    :host {
      display: block; height: 100%; overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .guide {
      max-width: 720px; margin: 0 auto; padding: 8px 0 32px;
    }
    h2 {
      font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;
    }
    .intro {
      color: #64748b; font-size: 13px; margin: 0 0 28px; line-height: 1.6;
    }
    .section {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 20px 24px; margin-bottom: 16px;
    }
    .section h3 {
      font-size: 14px; font-weight: 600; color: #1e293b; margin: 0 0 8px;
      display: flex; align-items: center; gap: 8px;
    }
    .section p {
      font-size: 13px; color: #475569; margin: 0; line-height: 1.65;
    }
    .section .icon {
      width: 20px; height: 20px; border-radius: 5px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 11px; flex-shrink: 0;
    }
    .icon-template { background: #dbeafe; color: #2563eb; }
    .icon-data { background: #dcfce7; color: #16a34a; }
    .icon-fill { background: #fef3c7; color: #d97706; }
    .icon-cookie { background: #fce7f3; color: #db2777; }
    .icon-shortcut { background: #e0e7ff; color: #4f46e5; }

    .shortcut-list {
      margin: 0; padding: 0; list-style: none;
    }
    .shortcut-list li {
      font-size: 13px; color: #475569; padding: 4px 0;
      display: flex; align-items: center; gap: 8px;
    }
    .shortcut-list li::before {
      content: '';
      width: 5px; height: 5px; border-radius: 50%;
      background: #94a3b8; flex-shrink: 0;
    }
    kbd {
      display: inline-block; padding: 1px 6px; border-radius: 4px;
      border: 1px solid #e2e8f0; background: #fff;
      font-size: 12px; font-family: inherit; color: #1e293b;
      box-shadow: 0 1px 0 #e2e8f0;
    }
  `;

  private _i18n = new I18nController(this);

  render() {
    return html`
      <div class="guide">
        <h2>${this._i18n.t('guide.title')}</h2>
        <p class="intro">${this._i18n.t('guide.overviewText')}</p>

        <div class="section">
          <h3><span class="icon icon-template">T</span>${this._i18n.t('guide.templateTitle')}</h3>
          <p>${this._i18n.t('guide.templateText')}</p>
        </div>

        <div class="section">
          <h3><span class="icon icon-data">D</span>${this._i18n.t('guide.dataTitle')}</h3>
          <p>${this._i18n.t('guide.dataText')}</p>
        </div>

        <div class="section">
          <h3><span class="icon icon-fill">&#x25B6;</span>${this._i18n.t('guide.fillTitle')}</h3>
          <p>${this._i18n.t('guide.fillText')}</p>
        </div>

        <div class="section">
          <h3><span class="icon icon-cookie">C</span>${this._i18n.t('guide.cookieTitle')}</h3>
          <p>${this._i18n.t('guide.cookieText')}</p>
        </div>

        <div class="section">
          <h3><span class="icon icon-shortcut">&#x2318;</span>${this._i18n.t('guide.shortcutTitle')}</h3>
          <ul class="shortcut-list">
            <li><kbd>Ctrl+C</kbd> ${this._i18n.t('guide.shortcutCopy').replace('Ctrl+C — ', '')}</li>
            <li><kbd>Ctrl+V</kbd> ${this._i18n.t('guide.shortcutPaste').replace('Ctrl+V — ', '')}</li>
            <li><kbd>Ctrl+D</kbd> ${this._i18n.t('guide.shortcutClear').replace('Ctrl+D — ', '')}</li>
          </ul>
        </div>
      </div>
    `;
  }
}
