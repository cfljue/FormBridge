import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type FormInputMode = 'form' | 'json';

@customElement('form-mode-tabs')
export class FormModeTabs extends LitElement {
  static styles = css`
    :host { display: block; margin: -8px 0 22px; }
    .tabs {
      display: inline-flex; gap: 3px; padding: 3px;
      border: 1px solid #d8e8df; border-radius: 9px; background: #f4faf6;
    }
    button {
      min-width: 92px; padding: 7px 14px; border: 0; border-radius: 6px;
      background: transparent; color: #64748b; cursor: pointer;
      font: 600 12px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: color 0.15s, background 0.15s, box-shadow 0.15s;
    }
    button:hover { color: #24724b; }
    button[aria-selected='true'] {
      background: #fff; color: #24724b; box-shadow: 0 1px 4px rgba(31, 110, 70, 0.13);
    }
    button:focus-visible { outline: 2px solid #7bc99a; outline-offset: 1px; }
  `;

  @property({ type: String }) active: FormInputMode = 'form';
  @property({ type: String }) formLabel = 'Form';
  @property({ type: String }) jsonLabel = 'JSON Import';

  private _select(mode: FormInputMode) {
    if (mode === this.active) return;
    this.active = mode;
    this.dispatchEvent(new CustomEvent('mode-change', {
      detail: { mode }, bubbles: true, composed: true,
    }));
  }

  render() {
    return html`
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected=${this.active === 'form'} @click=${() => this._select('form')}>${this.formLabel}</button>
        <button role="tab" aria-selected=${this.active === 'json'} @click=${() => this._select('json')}>${this.jsonLabel}</button>
      </div>
    `;
  }
}
