import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface RowAction {
  key: string;
  label: string;
}

export type TableRow = object;

export interface RowActionDetail {
  action: string;
  row: TableRow;
}

@customElement('data-table')
export class DataTable extends LitElement {
  static styles = css`
    :host { display: block; overflow-x: auto; }
    table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    td { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    th { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; user-select: none; }
    th.sortable { cursor: pointer; }
    th.sortable:hover { color: #2563eb; }
    tbody tr:hover td { background: #f8fafc; }
    .check-col { width: 42px; text-align: center; }
    input[type="checkbox"] { cursor: pointer; accent-color: #2563eb; width: 15px; height: 15px; }
    .actions { display: flex; gap: 6px; }
    .act-btn {
      padding: 0; font-size: 12px; cursor: pointer;
      border: none; background: none; color: #2563eb;
      transition: color 0.12s;
    }
    .act-btn:hover { color: #1d4ed8; text-decoration: underline; }
    .sort-arrow {
      display: inline-flex; flex-direction: column; vertical-align: middle;
      margin-left: 4px; font-size: 7px; line-height: 0.8;
    }
    .sort-arrow .up { margin-bottom: 1px; }
    .sort-arrow .up, .sort-arrow .down { color: #cbd5e1; }
    .sort-arrow.asc .up { color: #2563eb; }
    .sort-arrow.desc .down { color: #2563eb; }
    .empty-cell { text-align: center; padding: 40px 14px; color: #94a3b8; font-size: 13px; border-bottom: none; }
  `;

  @property({ type: Array }) columns: ColumnDef[] = [];
  @property({ type: Array }) rows: TableRow[] = [];
  @property({ type: Array }) selectedIds: string[] = [];
  @property({ type: String }) idKey = 'id';
  @property({ type: Array }) rowActions: RowAction[] = [];
  @property({ type: Boolean }) showCheckbox = true;
  @property({ type: String }) actionsHeader = 'Actions';
  @property({ type: String }) emptyText = 'No data';
  @property({ type: String }) sortKey = '';
  @property({ type: String }) sortDir: 'asc' | 'desc' = 'asc';

  private _toggleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.selectedIds = checked ? this.rows.map((row) => this._rowId(row)) : [];
    this._emitSelection();
  }

  private _toggleOne(id: string) {
    const idx = this.selectedIds.indexOf(id);
    if (idx >= 0) {
      this.selectedIds = [...this.selectedIds.slice(0, idx), ...this.selectedIds.slice(idx + 1)];
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
    this._emitSelection();
  }

  private _emitSelection() {
    this.dispatchEvent(new CustomEvent('selection-change', { detail: [...this.selectedIds], bubbles: true, composed: true }));
  }

  private _sort(key: string) {
    if (this.sortKey === key) {
      if (this.sortDir === 'asc') this.sortDir = 'desc';
      else if (this.sortDir === 'desc') { this.sortKey = ''; this.sortDir = 'asc'; }
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  private _emitAction(action: string, row: TableRow) {
    const detail: RowActionDetail = { action, row };
    this.dispatchEvent(new CustomEvent<RowActionDetail>('row-action', { detail, bubbles: true, composed: true }));
  }

  private _cell(row: TableRow, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  private _rowId(row: TableRow): string {
    return String(this._cell(row, this.idKey) ?? '');
  }

  private get _sortedRows() {
    if (!this.sortKey) return this.rows;
    return [...this.rows].sort((a, b) => {
      const va = String(this._cell(a, this.sortKey) ?? '');
      const vb = String(this._cell(b, this.sortKey) ?? '');
      const cmp = va.localeCompare(vb);
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  render() {
    const allSelected = this.rows.length > 0 && this.rows.every((row) => this.selectedIds.includes(this._rowId(row)));
    const colSpan = this.columns.length + (this.showCheckbox ? 1 : 0) + (this.rowActions.length > 0 ? 1 : 0);

    return html`
      <table>
        <thead>
          <tr>
            ${this.showCheckbox ? html`<th class="check-col"><input type="checkbox" .checked=${allSelected} @change=${this._toggleSelectAll} /></th>` : ''}
            ${this.columns.map((c) => html`
              <th class=${c.sortable ? 'sortable' : ''} style=${c.width ? `width:${c.width}` : ''} @click=${() => c.sortable && this._sort(c.key)}>
                ${c.label}
                ${c.sortable ? html`<span class="sort-arrow${this.sortKey === c.key ? (this.sortDir === 'asc' ? ' asc' : ' desc') : ''}"><span class="up">▲</span><span class="down">▼</span></span>` : ''}
              </th>
            `)}
            ${this.rowActions.length > 0 ? html`<th style="width:200px">${this.actionsHeader}</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this._sortedRows.map((row) => html`
            <tr>
              ${this.showCheckbox ? html`<td class="check-col"><input type="checkbox" .checked=${this.selectedIds.includes(this._rowId(row))} @change=${() => this._toggleOne(this._rowId(row))} /></td>` : ''}
              ${this.columns.map((c) => html`<td title=${String(this._cell(row, c.key) ?? '')}>${this._cell(row, c.key)}</td>`)}
              ${this.rowActions.length > 0 ? html`
                <td>
                  <div class="actions">
                    ${this.rowActions.map((a) => html`<button class="act-btn" @click=${() => this._emitAction(a.key, row)}>${a.label}</button>`)}
                  </div>
                </td>
              ` : ''}
            </tr>
          `)}
          ${this.rows.length === 0 ? html`<tr><td class="empty-cell" colspan=${colSpan}><slot name="empty">${this.emptyText}</slot></td></tr>` : ''}
        </tbody>
      </table>
    `;
  }
}
