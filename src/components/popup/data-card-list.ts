import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './data-card';

@customElement('data-card-list')
export class DataCardList extends LitElement {
  static styles = css`
    :host { display: block; }
    .grid {
      display: grid; gap: 5px;
    }
  `;

  @property({ type: Array }) records: Array<{ id: string; name: string; url: string; matched: boolean }> = [];
  @property({ type: Array }) order: string[] = [];
  @property({ type: Number }) columns = 3;

  private get _sorted() {
    return this.records;
  }

  private _onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  private _onDrop(e: DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer!.getData('text/plain'));
    if (isNaN(fromIndex) || fromIndex === toIndex) return;
    const ids = this._sorted.map((r) => r.id);
    const [moved] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, moved);
    this.dispatchEvent(new CustomEvent('order-change', { detail: ids, bubbles: true, composed: true }));
  }

  render() {
    const sorted = this._sorted;
    return html`
      <div class="grid" style="grid-template-columns:repeat(${this.columns},1fr)" @dragover=${this._onDragOver}>
        ${sorted.map((r, i) => html`
          <div @drop=${(e: DragEvent) => this._onDrop(e, i)}>
            <data-card
              .record=${{ id: r.id, name: r.name, url: r.url }}
              .matched=${r.matched}
              .draggable=${true}
              .index=${i}
            ></data-card>
          </div>
        `)}
      </div>
    `;
  }
}
