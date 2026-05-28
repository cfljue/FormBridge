import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';
import { StoreController } from '@store/store-controller';
import { templateStore } from '@store/template-store';
import { fuzzySearch } from '@utils/fuzzy-search';
import { type Template } from '@app-types/models';
import { type ColumnDef, type RowAction } from '@shared/data-table';
import '@shared/search-bar';
import '@shared/data-table';
import '@shared/batch-toolbar';
import '@shared/confirm-dialog';
import './template-modal';

@customElement('template-management')
export class TemplateManagement extends LitElement {
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
  private _templates = new StoreController(this, templateStore, true);
  @query('template-modal') private _modal!: HTMLElement & { mode: 'add' | 'edit' | 'copy' | 'extract'; open: (t?: Template) => void };
  @query('confirm-dialog') private _confirm!: HTMLElement & { open: boolean; title: string; message: string };

  private _searchQuery = '';
  private _selectedIds: string[] = [];
  private _deleteTarget: string[] = [];
  private _editData: Template | undefined;

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
      { key: 'export', label: this._i18n.t('config.export') },
    ];
  }

  private get _filtered(): Record<string, any>[] {
    return fuzzySearch(this._templates.state, this._searchQuery, ['name', 'description', 'url']) as unknown as Record<string, any>[];
  }

  private _onSearch(e: CustomEvent) { this._searchQuery = e.detail.value; this.requestUpdate(); }
  private _onSelection(e: CustomEvent) { this._selectedIds = e.detail; this.requestUpdate(); }

  private _onRowAction(e: CustomEvent) {
    const { action, row } = e.detail;
    const template = row as unknown as Template;
    switch (action) {
      case 'edit': this._editData = template; this._modal.mode = 'edit'; this._modal.open(template); break;
      case 'copy': this._editData = undefined; this._modal.mode = 'copy'; this._modal.open({ ...template, name: template.name + ' (Copy)' }); break;
      case 'delete': this._deleteTarget = [template.id];
        this._confirm.title = this._i18n.t('template.deleteTitle');
        this._confirm.message = this._i18n.t('template.deleteMsg', { name: template.name });
        this._confirm.open = true; break;
      case 'export': this._exportSelection([template.id]); break;
    }
  }

  private async _onConfirm() {
    if (this._deleteTarget.length) {
      const count = this._deleteTarget.length;
      await templateStore.deleteMany(this._deleteTarget);
      this._deleteTarget = []; this._selectedIds = [];
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('template.deleted', { count }), 'success');
    }
    this.requestUpdate();
  }

  private async _onTemplateSubmit(e: CustomEvent) {
    const detail = e.detail as Omit<Template, 'id' | 'createdAt' | 'updatedAt'>;
    if (this._editData) await templateStore.update(this._editData.id, detail);
    else await templateStore.add(detail);
    this._editData = undefined;
  }

  private _onBatchExport() { this._exportSelection(this._selectedIds); }
  private _exportSelection(ids: string[]) {
    const items = this._templates.state.filter((t) => ids.includes(t.id));
    if (!items.length) return;
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `templates-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  private async _onBatchImport(e: CustomEvent) {
    try {
      const items = JSON.parse(e.detail.content) as Template[];
      if (!Array.isArray(items)) throw new Error('Invalid format');
      const count = await templateStore.importFrom(items);
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('template.imported', { count }), 'success');
    } catch {
      const { showToast } = await import('@shared/toast-notification');
      showToast(this._i18n.t('template.importFailed'), 'error');
    }
  }

  private _onBatchDelete() {
    this._deleteTarget = [...this._selectedIds];
    this._confirm.title = this._i18n.t('template.deleteBatchTitle');
    this._confirm.message = this._i18n.t('template.deleteBatchMsg', { count: this._deleteTarget.length });
    this._confirm.open = true;
  }

  private _openAdd() { this._editData = undefined; this._modal.mode = 'add'; this._modal.open(); }

  connectedCallback() { super.connectedCallback(); this._templates.load(); }

  render() {
    const filtered = this._filtered;
    return html`
      <div class="top-row">
        <div class="top-row-left">
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t('template.new')}</button>
          <batch-toolbar
            .selectedCount=${this._selectedIds.length}
            @batch-export=${this._onBatchExport}
            @batch-import=${this._onBatchImport}
            @batch-delete=${this._onBatchDelete}
          ></batch-toolbar>
        </div>
        <search-bar placeholder=${this._i18n.t('config.searchTemplates')} @search-change=${this._onSearch}></search-bar>
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
          <span>${this._i18n.t('config.noTemplates')}</span>
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t('template.new')}</button>
        </div>
      </data-table>
      <template-modal @template-submit=${this._onTemplateSubmit}></template-modal>
      <confirm-dialog @confirm=${this._onConfirm}></confirm-dialog>
    `;
  }
}
