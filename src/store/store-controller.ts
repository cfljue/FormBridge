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
      this._store.load();
    }
  }

  hostDisconnected(): void {
    this._unsubscribe?.();
  }

  async load(): Promise<void> {
    await this._store.load();
  }
}
