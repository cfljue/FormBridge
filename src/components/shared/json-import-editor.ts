import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('json-import-editor')
export class JsonImportEditor extends LitElement {
  static styles = css`
    :host { display: block; }
    .heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
    label { color: #334155; font-size: 12px; font-weight: 700; }
    .hint { color: #718096; font-size: 11px; text-align: right; }
    textarea {
      width: 100%; min-height: 340px; resize: vertical; box-sizing: border-box;
      padding: 14px 16px; border: 1px solid #d8e8df; border-radius: 9px;
      background: #fbfefc; color: #1e293b; outline: none;
      font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      tab-size: 2; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }
    textarea:focus { border-color: #65b987; background: #fff; box-shadow: 0 0 0 3px rgba(101,185,135,0.16); }
    textarea[aria-invalid='true'] { border-color: #e87979; box-shadow: 0 0 0 3px rgba(232,121,121,0.12); }
    .error { margin: 8px 2px 0; color: #c24141; font-size: 12px; line-height: 1.45; }
  `;

  @property({ type: String }) label = 'JSON';
  @property({ type: String }) hint = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) value = '';
  @property({ type: String }) error = '';

  private _onInput(event: Event) {
    this.value = (event.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('json-change', {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  render() {
    return html`
      <div class="heading">
        <label for="json-input">${this.label}</label>
        <span class="hint">${this.hint}</span>
      </div>
      <textarea
        id="json-input"
        spellcheck="false"
        aria-invalid=${Boolean(this.error)}
        aria-describedby=${this.error ? 'json-error' : ''}
        .placeholder=${this.placeholder}
        .value=${this.value}
        @input=${this._onInput}
      ></textarea>
      ${this.error ? html`<p class="error" id="json-error" role="alert">${this.error}</p>` : null}
    `;
  }
}
