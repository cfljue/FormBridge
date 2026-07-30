import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { StoreController } from '@store/store-controller';
import { templateStore } from '@store/template-store';
import { dataRecordStore } from '@store/data-record-store';
import { fuzzySearch } from '@utils/fuzzy-search';
import { downloadJson, parseJsonArray } from '@utils/json-file';
import { type DataRecord, type Template } from '@app-types/models';
import { type ColumnDef, type RowAction, type RowActionDetail } from '@shared/data-table';
import '@shared/search-bar';
import '@shared/data-table';
import '@shared/batch-toolbar';
import '@shared/confirm-dialog';
import './data-wizard';
import './template-modal';

@customElement('data-management')
export class DataManagement extends LitElement {
  static styles = css`
    :host { display: block; }
    .top-row {
      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
    }
    .top-row-left {
      display: flex; align-items: center; gap: 8px;
    }
    .top-row search-bar { width: 260px; flex-shrink: 0; margin-left: auto; }
    .add-btn {
      padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
      background: #2563eb; color: #fff; border: 1px solid #2563eb; cursor: pointer;
      white-space: nowrap; transition: background 0.15s;
    }
    .add-btn:hover { background: #1d4ed8; }
  `;

  private _i18n = new I18nController(this);
  private _records = new StoreController(this, dataRecordStore, true);
  @query('data-wizard') private _wizard!: HTMLElement & { mode: 'add' | 'edit' | 'copy'; open: (r?: DataRecord) => void };
  @query('confirm-dialog') private _confirm!: HTMLElement & { open: boolean; title: string; message: string };
  @query('template-modal') private _tmodal!: HTMLElement & { mode: 'add' | 'edit' | 'copy' | 'extract'; open: (t?: Template) => void };

  private _searchQuery = '';
  private _selectedIds: string[] = [];
  private _deleteTarget: string[] = [];
  private _editData: DataRecord | undefined;

  private get _columns(): ColumnDef[] {
    return [
      { key: 'name', label: this._i18n.t('template.name'), sortable: true, width: '160px' },
      { key: 'url', label: this._i18n.t('template.url'), sortable: false, width: '240px' },
      { key: 'description', label: this._i18n.t('template.description'), sortable: false },
    ];
  }

  private get _actions(): RowAction[] {
    return [
      { key: 'edit', label: this._i18n.t('config.edit') },
      { key: 'copy', label: this._i18n.t('config.copy') },
      { key: 'delete', label: this._i18n.t('config.delete') },
      { key: 'extract', label: this._i18n.t('data.extractTemplate') },
      { key: 'export', label: this._i18n.t('config.export') },
    ];
  }

  private get _filtered(): DataRecord[] {
    return fuzzySearch(this._records.state, this._searchQuery, ['name', 'url']);
  }

  private _onSearch(e: CustomEvent<{ value: string }>) { this._searchQuery = e.detail.value; this.requestUpdate(); }
  private _onSelection(e: CustomEvent<string[]>) { this._selectedIds = e.detail; this.requestUpdate(); }

  private _onRowAction(e: CustomEvent<RowActionDetail>) {
    const { action, row } = e.detail;
    const record = row as DataRecord;
    switch (action) {
      case 'edit': this._editData = record; this._wizard.mode = 'edit'; this._wizard.open(record); break;
      case 'copy':
        this._wizard.mode = 'copy';
        this._wizard.open({ ...record, name: record.name + ' (Copy)' });
        break;
      case 'delete': this._deleteTarget = [record.id];
        this._confirm.title = this._i18n.t('data.deleteTitle');
        this._confirm.message = this._i18n.t('data.deleteMsg', { name: record.name });
        this._confirm.open = true; break;
      case 'extract': {
        const tmpl = templateStore.getById(record.templateId);
        const fields = record.values.length > 0
          ? record.values.map((v) => ({ id: v.name, name: v.name, selector: v.selector }))
          : (tmpl?.fields ?? []).map((f) => ({ id: f.id, name: f.name, selector: f.selector }));
        const t: Template = {
          id: '', name: record.name,
          description: record.description || tmpl?.description || '',
          url: record.url,
          fields,
          button: record.buttonSelector ? { name: record.buttonName || '', selector: record.buttonSelector } : undefined,
          createdAt: Date.now(), updatedAt: Date.now(),
        };
        this._tmodal.mode = 'extract';
        this._tmodal.open(t);
        break;
      }
      case 'export': this._exportSelection([record.id]); break;
    }
  }

  private async _onConfirm() {
    if (this._deleteTarget.length) {
      const count = this._deleteTarget.length;
      await dataRecordStore.deleteMany(this._deleteTarget);
      this._deleteTarget = []; this._selectedIds = [];
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('data.deleted', { count }), 'success');
      this.requestUpdate();
    }
  }

  private async _onDataSubmit(
    e: CustomEvent<Omit<DataRecord, 'id' | 'order' | 'createdAt' | 'updatedAt'>>
  ) {
    const detail = e.detail;
    if (this._editData) await dataRecordStore.update(this._editData.id, detail);
    else await dataRecordStore.add(detail);
    this._editData = undefined;
  }

  private async _onExtractSubmit(
    e: CustomEvent<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const detail = e.detail;
    await templateStore.add(detail);
    const { showToast } = await import('@shared/toast-notification');
    showToast(this._i18n.t('data.templateExtracted'), 'success');
  }

  private _onBatchExport() { this._exportSelection(this._selectedIds); }
  private _exportSelection(ids: string[]) {
    const items = this._records.state.filter((r) => ids.includes(r.id));
    downloadJson(items, 'data-records');
  }

  private async _onBatchImport(e: CustomEvent<{ content: string }>) {
    try {
      const items = parseJsonArray<DataRecord>(e.detail.content);
      const count = await dataRecordStore.importFrom(items);
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('data.imported', { count }), 'success');
    } catch {
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('data.importFailed'), 'error');
    }
  }

  private _onBatchDelete() {
    this._deleteTarget = [...this._selectedIds];
    this._confirm.title = this._i18n.t('data.deleteBatchTitle');
    this._confirm.message = this._i18n.t('data.deleteBatchMsg', { count: this._deleteTarget.length });
    this._confirm.open = true;
  }

  private _openAdd() { this._editData = undefined; this._wizard.mode = 'add'; this._wizard.open(); }

  render() {
    const filtered = this._filtered;
    return html`
      <div class="top-row">
        <div class="top-row-left">
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t('data.new')}</button>
          <batch-toolbar
            .selectedCount=${this._selectedIds.length}
            @batch-export=${this._onBatchExport}
            @batch-import=${this._onBatchImport}
            @batch-delete=${this._onBatchDelete}
          ></batch-toolbar>
        </div>
        <search-bar placeholder=${this._i18n.t('config.searchData')} @search-change=${this._onSearch}></search-bar>
      </div>
      <data-table
        .columns=${this._columns}
        .rows=${filtered}
        .selectedIds=${this._selectedIds}
        .rowActions=${this._actions}
        .actionsHeader=${this._i18n.t('config.actions')}
        @selection-change=${this._onSelection}
        @row-action=${this._onRowAction}
      >
        <div slot="empty" style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <span>${this._i18n.t('config.noData')}</span>
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t('data.new')}</button>
        </div>
      </data-table>
      <data-wizard @data-submit=${this._onDataSubmit}></data-wizard>
      <template-modal @template-submit=${this._onExtractSubmit}></template-modal>
      <confirm-dialog @confirm=${this._onConfirm}></confirm-dialog>
    `;
  }
}
