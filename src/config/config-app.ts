import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { I18nController, getLocale } from '@i18n/index';
import { settingsStore } from '@store/settings-store';
import '@config/tabs-nav';
import '@config/template-management';
import '@config/data-management';
import '@config/cookie-settings';
import '@config/guide-page';
import '@shared/toast-notification';

@customElement('config-app')
export class ConfigApp extends LitElement {
  static styles = css`
    :host {
      display: flex; flex-direction: column;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b; background: #f1f5f9;
    }

    .main {
      flex: 1; overflow: hidden;
      display: flex; flex-direction: column;
      padding: 24px 32px 32px;
    }
    .content-card {
      flex: 1;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
      overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .tab-body {
      flex: 1; overflow-y: auto;
      padding: 24px 32px 32px;
    }
  `;

  private _i18n = new I18nController(this);
  @state() private _tab = 'data';

  private _onTabChange(e: CustomEvent) { this._tab = e.detail; }
  private _toggleLang() { settingsStore.setLanguage(getLocale() === 'en' ? 'zh' : 'en'); }

  render() {
    return html`
      <div class="main">
        <div class="content-card">
          <tabs-nav .active=${this._tab} @tab-change=${this._onTabChange} @toggle-lang=${this._toggleLang}></tabs-nav>
          <div class="tab-body">
            ${this._tab === 'template'
              ? html`<template-management></template-management>`
              : this._tab === 'data'
              ? html`<data-management></data-management>`
              : this._tab === 'cookie'
              ? html`<cookie-settings></cookie-settings>`
              : html`<guide-page></guide-page>`}
          </div>
        </div>
      </div>
      <toast-notification></toast-notification>
    `;
  }
}
