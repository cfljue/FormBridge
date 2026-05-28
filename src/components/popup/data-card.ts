import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('data-card')
export class DataCard extends LitElement {
  static styles = css`
    :host { display: block; }
    .card {
      display: flex; align-items: center; gap: 4px;
      padding: 6px 8px;
      border-radius: 5px;
      border: 1px solid #e2e8f0;
      background: #fff;
      cursor: pointer;
      transition: border-color 0.12s, background 0.12s;
    }
    .card.matched {
      border-color: #86efac;
      background: #f0fdf4;
    }
    .card.matched:hover { border-color: #22c55e; }
    .card.dimmed { opacity: 0.5; cursor: not-allowed; }
    .card.dimmed:hover { opacity: 0.7; }

    .drag-handle {
      color: #cbd5e1; font-size: 12px; cursor: grab; flex-shrink: 0;
      line-height: 1; padding: 1px;
    }
    .drag-handle:active { cursor: grabbing; }

    .name {
      flex: 1; min-width: 0;
      font-size: 11px; font-weight: 600; color: #1e293b;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .url-link {
      font-size: 11px; color: #2563eb; cursor: pointer; flex-shrink: 0;
      padding: 3px 6px; border-radius: 4px; transition: background 0.12s;
    }
    .url-link:hover { background: #eff6ff; text-decoration: underline; }
  `;

  private _i18n = new I18nController(this);

  @property({ type: Object }) record!: { id: string; name: string; url: string };
  @property({ type: Boolean }) matched = false;
  @property({ type: Boolean }) draggable = false;
  @property({ type: Number }) index = 0;

  private _onClick() {
    if (this.matched) {
      this.dispatchEvent(new CustomEvent('card-fill', { detail: this.record, bubbles: true, composed: true }));
    }
  }

  private _onUrlClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('card-navigate', { detail: this.record.url, bubbles: true, composed: true }));
  }

  private _onDragStart(e: DragEvent) {
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', String(this.index));
  }

  render() {
    return html`
      <div class="card ${this.matched ? 'matched' : 'dimmed'}" @click=${this._onClick}>
        ${this.draggable ? html`<span class="drag-handle" draggable="true" @dragstart=${this._onDragStart} title="Drag to reorder">&#x2630;</span>` : ''}
        <span class="name" title=${this.record.name}>${this.record.name}</span>
        <span class="url-link" @click=${this._onUrlClick} title=${'前往：' + this.record.url}>${this._i18n.t('template.url')}</span>
      </div>
    `;
  }
}
