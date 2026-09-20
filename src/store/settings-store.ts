import { BaseStore } from './base-store';
import { type AppSettings, type AppLanguage } from '@app-types/models';
import { initLocale } from '@i18n/index';

const STORAGE_KEY = 'settings';

const DEFAULTS: AppSettings = {
  cookieCopyEnabled: false,
  dataCardOrder: [],
  language: 'en',
  popupWidth: 600,
};

export class SettingsStore extends BaseStore<AppSettings> {
  constructor() {
    super({ ...DEFAULTS });
  }

  async load(): Promise<void> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    if (result[STORAGE_KEY]) {
      this.replaceState({ ...DEFAULTS, ...result[STORAGE_KEY] });
    }
    // The store is the single source of truth for the language; i18n only listens for
    // changes made by another context.
    initLocale(this._state.language);
  }

  async persist(): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: this._state });
  }

  async setCookieCopyEnabled(enabled: boolean): Promise<void> {
    this.setState({ cookieCopyEnabled: enabled } as Partial<AppSettings>);
    await this.persist();
  }

  async setDataCardOrder(order: string[]): Promise<void> {
    this.setState({ dataCardOrder: order } as Partial<AppSettings>);
    await this.persist();
  }

  async setLanguage(language: AppLanguage): Promise<void> {
    this.setState({ language } as Partial<AppSettings>);
    initLocale(language);
    await this.persist();
  }

  get isCookieCopyEnabled(): boolean {
    return this._state.cookieCopyEnabled;
  }

  get dataCardOrder(): string[] {
    return this._state.dataCardOrder;
  }

  async setPopupWidth(width: number): Promise<void> {
    this.setState({ popupWidth: width } as Partial<AppSettings>);
    await this.persist();
  }

  get language(): AppLanguage {
    return this._state.language;
  }

  get popupWidth(): number {
    return this._state.popupWidth;
  }
}

export const settingsStore = new SettingsStore();
