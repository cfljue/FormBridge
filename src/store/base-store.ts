export abstract class BaseStore<T> {
  protected _state: T;
  private _listeners = new Set<(state: T) => void>();

  constructor(initialState: T) {
    this._state = initialState;
  }

  get state(): T {
    return this._state;
  }

  protected setState(partial: Partial<T>): void {
    this._state = { ...this._state, ...partial } as T;
    this._notify();
  }

  protected replaceState(newState: T): void {
    this._state = newState;
    this._notify();
  }

  subscribe(callback: (state: T) => void): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  private _notify(): void {
    for (const listener of this._listeners) {
      listener(this._state);
    }
  }

  abstract load(): Promise<void>;
  abstract persist(): Promise<void>;
}
