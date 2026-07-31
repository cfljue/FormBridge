import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('skill-prompt-card')
export class SkillPromptCard extends LitElement {
  static styles = css`
    :host { display: block; margin-bottom: 20px; }
    .card {
      position: relative; overflow: hidden;
      display: grid; grid-template-columns: 30px minmax(0, 1fr) auto;
      align-items: center; gap: 12px; padding: 13px 14px;
      border: 1px solid #cfe7d8; border-radius: 9px;
      background: linear-gradient(110deg, #f3faf5 0%, #fbfefc 68%, #f6fbf7 100%);
    }
    .card::before {
      content: ''; position: absolute; inset: 0 auto 0 0; width: 3px;
      background: #55a978;
    }
    .icon {
      width: 30px; height: 30px; border-radius: 8px;
      display: grid; place-items: center;
      color: #28734a; background: #dff2e6;
    }
    .icon svg { width: 16px; height: 16px; }
    .content { min-width: 0; }
    .title { color: #245a3a; font-size: 12px; font-weight: 700; line-height: 1.3; }
    .description {
      margin-top: 3px; color: #607467; font-size: 11px; line-height: 1.45;
      display: -webkit-box; overflow: hidden;
      -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    }
    button {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 11px; border: 1px solid #b9dbc6; border-radius: 7px;
      background: #fff; color: #28734a; cursor: pointer;
      font: 600 11px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transition: background 0.15s, border-color 0.15s, transform 0.15s;
    }
    button:hover { background: #edf8f1; border-color: #8fc5a3; }
    button:active { transform: translateY(1px); }
    button:focus-visible { outline: 2px solid #70bd8d; outline-offset: 2px; }
    button svg { width: 13px; height: 13px; }
    @media (max-width: 560px) {
      .card { grid-template-columns: 30px 1fr; }
      button { grid-column: 2; justify-self: start; }
      .description { -webkit-line-clamp: 3; }
    }
  `;

  @property({ type: String }) title = '';
  @property({ type: String }) description = '';
  @property({ type: String }) prompt = '';
  @property({ type: String }) copyLabel = 'Copy prompt';
  @property({ type: String }) copiedLabel = 'Copied';
  @property({ type: String }) failedLabel = 'Copy failed';
  @state() private _status: 'idle' | 'copied' | 'failed' = 'idle';
  private _resetTimer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resetTimer) clearTimeout(this._resetTimer);
  }

  private async _copy() {
    try {
      await navigator.clipboard.writeText(this.prompt);
      this._status = 'copied';
    } catch {
      this._status = 'failed';
    }
    if (this._resetTimer) clearTimeout(this._resetTimer);
    this._resetTimer = setTimeout(() => { this._status = 'idle'; }, 2200);
  }

  render() {
    const label = this._status === 'copied'
      ? this.copiedLabel
      : this._status === 'failed' ? this.failedLabel : this.copyLabel;
    return html`
      <aside class="card">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 3.5v3M5.8 6l2.1 2.1M18.2 6l-2.1 2.1M4 12h3M17 12h3" />
            <path d="M9.2 14.5a4.2 4.2 0 1 1 5.6 0c-.8.5-1.2 1.2-1.2 2H10.4c0-.8-.4-1.5-1.2-2Z" />
            <path d="M10.3 19h3.4" />
          </svg>
        </span>
        <div class="content">
          <div class="title">${this.title}</div>
          <div class="description" title=${this.description}>${this.description}</div>
        </div>
        <button type="button" @click=${this._copy} aria-label=${label}>
          ${this._status === 'copied' ? html`
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 8.5 3 3 7-7" /></svg>
          ` : html`
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V3"/></svg>
          `}
          ${label}
        </button>
      </aside>
    `;
  }
}
