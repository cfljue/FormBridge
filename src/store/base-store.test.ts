import { describe, it, expect, vi } from 'vitest';
import { BaseStore } from './base-store';

// Concrete subclass for testing
class TestStore extends BaseStore<{ count: number; name: string }> {
  constructor() {
    super({ count: 0, name: '' });
  }
  async load(): Promise<void> { /* noop */ }
  async persist(): Promise<void> { /* noop */ }
  // Expose protected methods for testing
  testSetState(partial: Partial<{ count: number; name: string }>) {
    this.setState(partial);
  }
  testReplaceState(newState: { count: number; name: string }) {
    this.replaceState(newState);
  }
}

describe('BaseStore', () => {
  describe('state getter', () => {
    it('returns initial state', () => {
      const store = new TestStore();
      expect(store.state).toEqual({ count: 0, name: '' });
    });
  });

  describe('setState (shallow merge)', () => {
    it('merges partial state', () => {
      const store = new TestStore();
      store.testSetState({ count: 5 });
      expect(store.state).toEqual({ count: 5, name: '' });
    });

    it('preserves untouched fields', () => {
      const store = new TestStore();
      store.testSetState({ name: 'hello' });
      expect(store.state.count).toBe(0);
    });
  });

  describe('replaceState', () => {
    it('replaces entire state', () => {
      const store = new TestStore();
      store.testReplaceState({ count: 10, name: 'replaced' });
      expect(store.state).toEqual({ count: 10, name: 'replaced' });
    });
  });

  describe('subscribe', () => {
    it('notifies listener on setState', () => {
      const store = new TestStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.testSetState({ count: 1 });
      expect(listener).toHaveBeenCalledWith({ count: 1, name: '' });
    });

    it('notifies listener on replaceState', () => {
      const store = new TestStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.testReplaceState({ count: 99, name: 'x' });
      expect(listener).toHaveBeenCalledWith({ count: 99, name: 'x' });
    });

    it('does not notify after unsubscribe', () => {
      const store = new TestStore();
      const listener = vi.fn();
      const unsub = store.subscribe(listener);
      unsub();

      store.testSetState({ count: 1 });
      expect(listener).not.toHaveBeenCalled();
    });

    it('notifies multiple subscribers', () => {
      const store = new TestStore();
      const a = vi.fn();
      const b = vi.fn();
      store.subscribe(a);
      store.subscribe(b);

      store.testSetState({ name: 'multi' });
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });
  });
});
