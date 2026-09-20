import { ReactiveController, ReactiveControllerHost } from 'lit';
import type { BaseStore } from './base-store';

export class StoreController<T> implements ReactiveController {
  private _unsubscribe?: () => void;

  constructor(
    private _host: ReactiveControllerHost,
    private _store: BaseStore<T>,
    private _autoLoad = false
  ) {
    this._host.addController(this);
  }

  get state(): T {
    return this._store.state;
  }

  get store(): BaseStore<T> {
    return this._store;
  }

  hostConnected(): void {
    this._unsubscribe = this._store.subscribe(() => {
      this._host.requestUpdate();
    });
    if (this._autoLoad) {
      void this.load();
    }
  }

  hostDisconnected(): void {
    this._unsubscribe?.();
  }

  async load(): Promise<void> {
    try {
      await this._store.load();
    } catch (error) {
      // A failing load must not leave an unhandled rejection behind: the host renders with
      // whatever state the store already has instead of staying blank.
      console.error('[FormBridge] Failed to load store state.', error);
    }
  }
}
