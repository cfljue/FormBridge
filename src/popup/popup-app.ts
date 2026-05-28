import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { I18nController, getLocale } from '@i18n/index';
import { StoreController } from '@store/store-controller';
import { dataRecordStore } from '@store/data-record-store';
import { settingsStore } from '@store/settings-store';
import { urlMatches } from '@utils/url-matcher';
import { showToast } from '@shared/toast-notification';
import '@popup/data-card-list';
import '@shared/search-bar';
import '@shared/toast-notification';
import '@shared/empty-state';

const WIDTH_OPTIONS = [400, 600, 800];

@customElement('popup-app')
export class PopupApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b; background: #fff;
    }
    .root {
      width: var(--popup-width, 600px);
    }

    .topbar {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    search-bar { flex: 1; min-width: 0; }
    .hdr-btn {
      font-size: 12px; color: #475569; cursor: pointer;
      padding: 5px 12px; border-radius: 5px;
      border: 1px solid #e2e8f0; background: #fff;
      transition: all 0.12s; white-space: nowrap; line-height: 1.4;
    }
    .hdr-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .width-select {
      font-size: 11px; padding: 5px 4px; border-radius: 5px;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      outline: none; cursor: pointer; font-family: inherit;
    }

    .cards-area {
      padding: 8px 12px 14px;
      max-height: 480px; overflow-y: auto;
    }
    .cards-area::-webkit-scrollbar { width: 4px; }
    .cards-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `;

  private _i18n = new I18nController(this);
  private _records = new StoreController(this, dataRecordStore);
  private _settings = new StoreController(this, settingsStore);

  @state() private _currentUrl = '';
  @state() private _searchQuery = '';

  private _activeTabId = 0;

  connectedCallback() {
    super.connectedCallback();
    this._records.load();
    this._settings.load();
    this._fetchCurrentTab();
    window.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
  }

  private async _fetchCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this._currentUrl = tab?.url ?? '';
    this._activeTabId = tab?.id ?? 0;
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    // Don't intercept when typing in inputs — use composedPath for Shadow DOM
    const actualTarget = e.composedPath()[0] as HTMLElement;
    const tag = actualTarget?.tagName?.toLowerCase();
    const editable = actualTarget?.isContentEditable;
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || editable) return;

    if (e.key === 'c' || e.key === 'С') {
      e.preventDefault();
      this._copyCookies();
    } else if (e.key === 'v' || e.key === 'В') {
      e.preventDefault();
      this._pasteCookies();
    } else if (e.key === 'd') {
      e.preventDefault();
      this._clearCookies();
    }
  };

  private async _getTabId(): Promise<number> {
    if (this._activeTabId) return this._activeTabId;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this._activeTabId = tab?.id ?? 0;
    return this._activeTabId;
  }

  private async _copyCookies() {
    if (!settingsStore.isCookieCopyEnabled) return;
    const tabId = await this._getTabId();
    if (!tabId) {
      showToast(this._i18n.t('popup.noActiveTab'), 'warning');
      return;
    }
    try {
      const resp = await chrome.runtime.sendMessage({
        action: 'COPY_COOKIES',
        payload: { tabId },
      });
      showToast(
        resp?.message ?? this._i18n.t('popup.copyFailed'),
        resp?.success ? 'success' : 'error'
      );
    } catch {
      showToast(this._i18n.t('popup.copyFailed'), 'error');
    }
  }

  private async _pasteCookies() {
    if (!settingsStore.isCookieCopyEnabled) return;
    const tabId = await this._getTabId();
    if (!tabId) {
      showToast(this._i18n.t('popup.noActiveTab'), 'warning');
      return;
    }
    try {
      const resp = await chrome.runtime.sendMessage({
        action: 'PASTE_COOKIES',
        payload: { tabId },
      });
      // success: all good → green; partial → yellow; all failed → red
      let type: 'success' | 'error' | 'warning' = 'error';
      if (resp?.success) {
        type = 'success';
      } else if (resp?.total > 0 && resp?.failed < resp?.total) {
        type = 'warning';
      }
      showToast(
        resp?.message ?? this._i18n.t('popup.pasteFailed'),
        type
      );
    } catch {
      showToast(this._i18n.t('popup.pasteFailed'), 'error');
    }
  }

  private async _clearCookies() {
    if (!settingsStore.isCookieCopyEnabled) return;
    const tabId = await this._getTabId();
    if (!tabId) {
      showToast(this._i18n.t('popup.noActiveTab'), 'warning');
      return;
    }
    try {
      const resp = await chrome.runtime.sendMessage({
        action: 'CLEAR_COOKIES',
        payload: { tabId },
      });
      let type: 'success' | 'error' | 'warning' = 'error';
      if (resp?.success && resp?.failed === 0) {
        type = 'success';
      } else if (resp?.removed > 0 && resp?.failed > 0) {
        type = 'warning';
      }
      const msg = resp?.message ?? this._i18n.t('popup.clearFailed');
      showToast(msg, type);
    } catch {
      showToast(this._i18n.t('popup.clearFailed'), 'error');
    }
  }

  private _onSearch(e: CustomEvent) { this._searchQuery = e.detail.value; }

  private _onWidthChange(e: Event) {
    const v = Number((e.target as HTMLSelectElement).value);
    if (v) settingsStore.setPopupWidth(v);
  }

  private get _columns(): number {
    return Math.round(this._settings.state.popupWidth / 200);
  }

  private async _onCardFill(e: CustomEvent) {
    const record = e.detail as { id: string };
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    const full = dataRecordStore.getById(record.id);
    if (!full) return;
    try {
      const resp = await chrome.runtime.sendMessage({
        action: 'AUTO_FILL_FORM',
        payload: { tabId: tab.id, record: full },
      });
      const total = resp?.total ?? resp?.filled ?? 0;
      const filled = resp?.filled ?? 0;
      const missed = total - filled;
      const hasWarn = (resp?.failed > 0) || (resp?.selectorMissed?.length > 0);
      const type = resp?.success === false ? 'error' : hasWarn ? 'warning' : 'success';
      showToast(
        resp?.message ??
          (missed > 0
            ? this._i18n.t('popup.fillPartial', { filled, total, missed })
            : this._i18n.t('popup.fillSuccess', { filled, total })),
        type
      );
    } catch { showToast(this._i18n.t('popup.fillFailed'), 'error'); }
  }

  private _onCardNavigate(e: CustomEvent) { chrome.tabs.create({ url: e.detail }); }

  private async _onOrderChange(e: CustomEvent) {
    await settingsStore.setDataCardOrder(e.detail);
  }

  private _openConfig() { chrome.runtime.openOptionsPage(); }
  private _toggleLang() { settingsStore.setLanguage(getLocale() === 'en' ? 'zh' : 'en'); }

  private _getCards() {
    let records = this._records.state;
    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      records = records.filter((r) => r.name.toLowerCase().includes(q) || r.url.toLowerCase().includes(q));
    }
    const matched: typeof records = [];
    const unmatched: typeof records = [];
    for (const r of records) {
      if (urlMatches(this._currentUrl, r.url)) matched.push(r);
      else unmatched.push(r);
    }
    const orderMap = new Map(this._settings.state.dataCardOrder.map((id, i) => [id, i]));
    const sortByOrder = (a: typeof records[0], b: typeof records[0]) => {
      const oa = orderMap.get(a.id) ?? a.order;
      const ob = orderMap.get(b.id) ?? b.order;
      return oa - ob;
    };
    matched.sort(sortByOrder);
    unmatched.sort(sortByOrder);
    return [...matched, ...unmatched];
  }

  render() {
    const cards = this._getCards();
    const pw = this._settings.state.popupWidth;

    return html`
      <div class="root" style="--popup-width:${pw}px">
      <div class="topbar">
        <search-bar placeholder=${this._i18n.t('popup.search')} @search-change=${this._onSearch}></search-bar>
        <select class="width-select" @change=${this._onWidthChange}>
          ${WIDTH_OPTIONS.map((w) => html`<option value=${w} ?selected=${pw === w}>${w}px</option>`)}
        </select>
        <button class="hdr-btn" @click=${this._toggleLang}>${this._i18n.t('lang.switch')}</button>
        <button class="hdr-btn" @click=${this._openConfig}>${this._i18n.t('popup.configure')}</button>
      </div>

      <div class="cards-area">
        ${cards.length > 0
          ? html`
              <data-card-list
                .records=${cards.map((r) => ({ id: r.id, name: r.name, url: r.url, matched: urlMatches(this._currentUrl, r.url) }))}
                .order=${this._settings.state.dataCardOrder}
                .columns=${this._columns}
                @card-fill=${this._onCardFill}
                @card-navigate=${this._onCardNavigate}
                @order-change=${this._onOrderChange}
              ></data-card-list>
            `
          : html`<empty-state message=${this._i18n.t('popup.noData')}></empty-state>`}
      </div>
      </div>

      <toast-notification></toast-notification>
    `;
  }
}
