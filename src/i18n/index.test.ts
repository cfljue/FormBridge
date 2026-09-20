import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStorageMock } from '../__tests__/chrome-mock';

// Must set up chrome mock BEFORE importing i18n (module-level init code)
const storageMock = createStorageMock({ settings: { language: 'en' } });
(globalThis as Record<string, unknown>).chrome = {
  storage: storageMock,
};

import { t, setLocale, getLocale, subscribeLocale, type TranslationKey, initLocale } from './index';

describe('i18n', () => {
  beforeEach(() => {
    // Reset to known state before each test
    setLocale('en');
  });

  describe('t()', () => {
    it('returns English translation by default', () => {
      expect(t('popup.search')).toBe('Search config...');
    });

    it('returns Chinese translation after switching locale', () => {
      setLocale('zh');
      expect(t('popup.search')).toBe('搜索配置...');
    });

    it('falls back to English when key is missing in current locale', () => {
      // Force a scenario where a key only exists in EN
      const result = t('popup.matchBadge' as TranslationKey);
      expect(result).toBe('Match'); // EN value
    });

    it('returns the key itself when not found in any locale', () => {
      const result = t('nonexistent.key' as TranslationKey);
      expect(result).toBe('nonexistent.key');
    });

    it('interpolates parameters', () => {
      const result = t('config.selected' as TranslationKey, { count: 5 });
      expect(result).toBe('5 selected');
    });

    it('interpolates multiple parameters', () => {
      setLocale('zh');
      const result = t('popup.fillPartial' as TranslationKey, { filled: 3, total: 5, missed: 2 });
      expect(result).toBe('已填充 3/5 个字段。未命中: 2');
    });

    it('provides an Agent prompt that asks for the URL and optional description first', () => {
      const prompt = t('config.skillPrompt');
      expect(prompt).toContain('github.com/cfljue/FormBridge/tree/main/skills/extract-login-form');
      expect(prompt).toContain('first ask me only two questions');
      expect(prompt).toContain('target page URL');
      expect(prompt).toContain('description');
    });
  });

  describe('setLocale / getLocale', () => {
    it('getLocale returns current locale', () => {
      expect(getLocale()).toBe('en');
      setLocale('zh');
      expect(getLocale()).toBe('zh');
    });

    it('initLocale is alias for setLocale', () => {
      initLocale('zh');
      expect(getLocale()).toBe('zh');
    });
  });

  describe('subscribeLocale', () => {
    it('notifies subscribers when locale changes', () => {
      let called = false;
      const unsub = subscribeLocale(() => { called = true; });
      setLocale('zh');
      expect(called).toBe(true);
      unsub();
    });

    it('stops notifying after unsubscribe', () => {
      let count = 0;
      const unsub = subscribeLocale(() => { count++; });
      setLocale('zh');
      expect(count).toBe(1);
      unsub();
      setLocale('en');
      expect(count).toBe(1); // no change
    });
  });
});
