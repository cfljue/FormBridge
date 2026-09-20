import { ReactiveController, ReactiveControllerHost } from 'lit';
import en from './locales/en';
import zh from './locales/zh';

export type Locale = 'en' | 'zh';
export type TranslationKey = keyof typeof en;

const locales: Record<Locale, Record<string, string>> = { en, zh };
let currentLocale: Locale = 'en';
let listeners = new Set<() => void>();

export function setLocale(locale: Locale): void {
  if (locale === currentLocale) return;
  currentLocale = locale;
  for (const fn of listeners) fn();
}

export function getLocale(): Locale {
  return currentLocale;
}

export function subscribeLocale(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let text = locales[currentLocale]?.[key] ?? locales.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

export function initLocale(locale: Locale): void {
  setLocale(locale);
}

// ── Cross-context sync ──
// The stored language is applied by settingsStore.load(); this listener only reacts to changes
// made in another context (popup <-> config page).
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.settings) {
      const lang = (changes.settings.newValue as Record<string, unknown> | undefined)?.language;
      if (lang === 'en' || lang === 'zh') {
        setLocale(lang as Locale);
      }
    }
  });
}

// ── Lit controller ──
export class I18nController implements ReactiveController {
  private _unsub?: () => void;

  constructor(private _host: ReactiveControllerHost) {
    this._host.addController(this);
  }

  hostConnected(): void {
    this._unsub = subscribeLocale(() => this._host.requestUpdate());
  }

  hostDisconnected(): void {
    this._unsub?.();
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    return t(key, params);
  }
}
