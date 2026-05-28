import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from '@utils/debounce';

@customElement('search-bar')
export class SearchBar extends LitElement {
  static styles = css`
    :host { display: block; }
    .wrap { position: relative; display: flex; align-items: center; }
    .icon {
      position: absolute;
      left: 10px;
      color: #94a3b8;
      font-size: 13px;
      pointer-events: none;
    }
    input {
      width: 100%;
      padding: 8px 32px 8px 32px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 400;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
      color: #1e293b;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus {
      border-color: #93c5fd;
      box-shadow: 0 0 0 3px rgba(147,197,253,0.2);
    }
    input::placeholder {
      color: #94a3b8;
      opacity: 1;
    }
    .clear {
      position: absolute; right: 5px;
      background: none; border: none;
      cursor: pointer;
      color: #94a3b8; font-size: 18px;
      line-height: 1; padding: 4px 6px;
      display: none;
      border-radius: 4px;
    }
    .clear.visible { display: block; }
    .clear:hover { color: #64748b; background: #f1f5f9; }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Search...';
  @property({ type: Number }) debounceMs = 250;

  private _emit = debounce((v: string) => {
    this.dispatchEvent(new CustomEvent('search-change', { detail: { value: v }, bubbles: true, composed: true }));
  }, this.debounceMs);

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this._emit(this.value);
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('search-change', { detail: { value: this.value }, bubbles: true, composed: true }));
    }
  }

  private _clear() {
    this.value = '';
    this._emit('');
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="wrap">
        <span class="icon">&#x1F50D;</span>
        <input
          type="text"
          .value=${this.value}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
        />
        <button class="clear ${this.value ? 'visible' : ''}" @click=${this._clear}>&times;</button>
      </div>
    `;
  }
}
