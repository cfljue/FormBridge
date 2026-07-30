const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/toast-notification-k-5Jv9PO.js","assets/lit-D6WVJR7_.js"])))=>i.map(i=>d[i]);
import{I as t,B as e,g as o,S as i,d as s,s as n,a}from"./toast-notification-k-5Jv9PO.js";import{i as r,n as l,a as d,b as c,t as p,e as h,r as g}from"./lit-D6WVJR7_.js";var u=Object.defineProperty,b=Object.getOwnPropertyDescriptor,f=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?b(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&u(e,o,n),n};let m=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.active="data"}_select(t){this.active=t,this.dispatchEvent(new CustomEvent("tab-change",{detail:t,bubbles:!0,composed:!0}))}render(){return c`
      <div class="brand">
        <span class="logo-icon">&#x25C6;</span>
        ${this._i18n.t("config.title")}
      </div>
      <div class="tabs">
        <button class=${"data"===this.active?"active":""} @click=${()=>this._select("data")}>${this._i18n.t("config.tabData")}</button>
        <button class=${"template"===this.active?"active":""} @click=${()=>this._select("template")}>${this._i18n.t("config.tabTemplates")}</button>
        <button class=${"cookie"===this.active?"active":""} @click=${()=>this._select("cookie")}>${this._i18n.t("config.tabCookie")}</button>
      </div>
      <div class="spacer"></div>
      <div class="right-actions">
        <button class="guide-btn ${"guide"===this.active?"active":""}" @click=${()=>this._select("guide")}>${this._i18n.t("config.tabGuide")}</button>
        <button class="lang-btn" @click=${()=>this.dispatchEvent(new CustomEvent("toggle-lang",{bubbles:!0,composed:!0}))}>${this._i18n.t("lang.switch")}</button>
      </div>
    `}};m.styles=r`
    :host {
      display: flex; align-items: center; gap: 0; flex-shrink: 0;
      background: #f8fafc; border-bottom: 1px solid #e2e8f0;
      padding: 0 24px;
    }
    .brand {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 700; color: #0f172a;
      margin-right: 24px; white-space: nowrap;
    }
    .logo-icon {
      width: 24px; height: 24px; background: #2563eb; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 13px;
    }
    .tabs {
      display: flex; align-items: center;
    }
    .tabs button {
      padding: 14px 20px; border: none; background: none; cursor: pointer;
      font-size: 13px; font-weight: 500; color: #64748b;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: color 0.15s, border-color 0.15s;
    }
    .tabs button:hover { color: #1e293b; }
    .tabs button.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }

    .spacer { flex: 1; }
    .right-actions {
      display: flex; align-items: center; gap: 8px;
    }
    .guide-btn {
      padding: 5px 14px; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #64748b;
      transition: all 0.15s; white-space: nowrap;
    }
    .guide-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .guide-btn.active { border-color: #2563eb; color: #2563eb; background: #eff6ff; font-weight: 600; }
    .lang-btn {
      padding: 5px 14px; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s; white-space: nowrap;
    }
    .lang-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
  `,f([l({type:String})],m.prototype,"active",2),m=f([p("tabs-nav")],m);const x={},y=function(t,e,o){let i=Promise.resolve();if(e&&e.length>0){let t=function(t){return Promise.all(t.map(t=>Promise.resolve(t).then(t=>({status:"fulfilled",value:t}),t=>({status:"rejected",reason:t}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),s=o?.nonce||o?.getAttribute("nonce");i=t(e.map(t=>{if((t=function(t){return"/"+t}(t))in x)return;x[t]=!0;const e=t.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${o}`))return;const i=document.createElement("link");return i.rel=e?"stylesheet":"modulepreload",e||(i.as="script"),i.crossOrigin="",i.href=t,s&&i.setAttribute("nonce",s),document.head.appendChild(i),e?new Promise((e,o)=>{i.addEventListener("load",e),i.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${t}`)))}):void 0}))}function s(t){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=t,window.dispatchEvent(e),!e.defaultPrevented)throw t}return i.then(e=>{for(const t of e||[])"rejected"===t.status&&s(t.reason);return t().catch(s)})},_="templates";const w=new class extends e{constructor(){super([])}async load(){const t=await chrome.storage.local.get(_);this.replaceState(t[_]??[])}async persist(){await chrome.storage.local.set({[_]:this._state})}_newTemplate(t,e,i,s,n){const a=Date.now();return{id:o(),name:t,description:e,url:i,fields:s.map(t=>({...t,id:t.id||o()})),button:n&&n.selector?{...n}:void 0,createdAt:a,updatedAt:a}}async add(t){const e=this._newTemplate(t.name,t.description,t.url,t.fields,t.button);return this.replaceState([e,...this._state]),await this.persist(),e}async update(t,e){this.replaceState(this._state.map(i=>i.id===t?{...i,...e,fields:e.fields?e.fields.map(t=>({...t,id:t.id||o()})):i.fields,button:void 0!==e.button?e.button&&e.button.selector?{...e.button}:void 0:i.button,updatedAt:Date.now()}:i)),await this.persist()}async delete(t){this.replaceState(this._state.filter(e=>e.id!==t)),await this.persist()}async deleteMany(t){const e=new Set(t);this.replaceState(this._state.filter(t=>!e.has(t.id))),await this.persist()}getById(t){return this._state.find(e=>e.id===t)}async importFrom(t){const e=new Set(this._state.map(t=>t.id)),o=t.filter(t=>!e.has(t.id));return o.length>0&&(this.replaceState([...o,...this._state]),await this.persist()),o.length}};function v(t,e,o){if(!e.trim())return t;const i=e.toLowerCase();return t.filter(t=>o.some(e=>{const o=t[e];return"string"==typeof o&&o.toLowerCase().includes(i)}))}function k(t,e){if(0===t.length)return;const o=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(o),s=document.createElement("a");s.href=i,s.download=`${e}-${(new Date).toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(i)}function $(t){const e=JSON.parse(t);if(!Array.isArray(e))throw new Error("Invalid JSON array");return e}var S=Object.defineProperty,D=Object.getOwnPropertyDescriptor,C=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?D(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&S(e,o,n),n};let T=class extends d{constructor(){super(...arguments),this.columns=[],this.rows=[],this.selectedIds=[],this.idKey="id",this.rowActions=[],this.showCheckbox=!0,this.actionsHeader="Actions",this.emptyText="No data",this.sortKey="",this.sortDir="asc"}_toggleSelectAll(t){const e=t.target.checked;this.selectedIds=e?this.rows.map(t=>this._rowId(t)):[],this._emitSelection()}_toggleOne(t){const e=this.selectedIds.indexOf(t);this.selectedIds=e>=0?[...this.selectedIds.slice(0,e),...this.selectedIds.slice(e+1)]:[...this.selectedIds,t],this._emitSelection()}_emitSelection(){this.dispatchEvent(new CustomEvent("selection-change",{detail:[...this.selectedIds],bubbles:!0,composed:!0}))}_sort(t){this.sortKey===t?"asc"===this.sortDir?this.sortDir="desc":"desc"===this.sortDir&&(this.sortKey="",this.sortDir="asc"):(this.sortKey=t,this.sortDir="asc")}_emitAction(t,e){const o={action:t,row:e};this.dispatchEvent(new CustomEvent("row-action",{detail:o,bubbles:!0,composed:!0}))}_cell(t,e){return t[e]}_rowId(t){return String(this._cell(t,this.idKey)??"")}get _sortedRows(){return this.sortKey?[...this.rows].sort((t,e)=>{const o=String(this._cell(t,this.sortKey)??""),i=String(this._cell(e,this.sortKey)??""),s=o.localeCompare(i);return"asc"===this.sortDir?s:-s}):this.rows}render(){const t=this.rows.length>0&&this.rows.every(t=>this.selectedIds.includes(this._rowId(t))),e=this.columns.length+(this.showCheckbox?1:0)+(this.rowActions.length>0?1:0);return c`
      <table>
        <thead>
          <tr>
            ${this.showCheckbox?c`<th class="check-col"><input type="checkbox" .checked=${t} @change=${this._toggleSelectAll} /></th>`:""}
            ${this.columns.map(t=>c`
              <th class=${t.sortable?"sortable":""} style=${t.width?`width:${t.width}`:""} @click=${()=>t.sortable&&this._sort(t.key)}>
                ${t.label}
                ${t.sortable?c`<span class="sort-arrow${this.sortKey===t.key?"asc"===this.sortDir?" asc":" desc":""}"><span class="up">▲</span><span class="down">▼</span></span>`:""}
              </th>
            `)}
            ${this.rowActions.length>0?c`<th style="width:200px">${this.actionsHeader}</th>`:""}
          </tr>
        </thead>
        <tbody>
          ${this._sortedRows.map(t=>c`
            <tr>
              ${this.showCheckbox?c`<td class="check-col"><input type="checkbox" .checked=${this.selectedIds.includes(this._rowId(t))} @change=${()=>this._toggleOne(this._rowId(t))} /></td>`:""}
              ${this.columns.map(e=>c`<td title=${String(this._cell(t,e.key)??"")}>${this._cell(t,e.key)}</td>`)}
              ${this.rowActions.length>0?c`
                <td>
                  <div class="actions">
                    ${this.rowActions.map(e=>c`<button class="act-btn" @click=${()=>this._emitAction(e.key,t)}>${e.label}</button>`)}
                  </div>
                </td>
              `:""}
            </tr>
          `)}
          ${0===this.rows.length?c`<tr><td class="empty-cell" colspan=${e}><slot name="empty">${this.emptyText}</slot></td></tr>`:""}
        </tbody>
      </table>
    `}};T.styles=r`
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
  `,C([l({type:Array})],T.prototype,"columns",2),C([l({type:Array})],T.prototype,"rows",2),C([l({type:Array})],T.prototype,"selectedIds",2),C([l({type:String})],T.prototype,"idKey",2),C([l({type:Array})],T.prototype,"rowActions",2),C([l({type:Boolean})],T.prototype,"showCheckbox",2),C([l({type:String})],T.prototype,"actionsHeader",2),C([l({type:String})],T.prototype,"emptyText",2),C([l({type:String})],T.prototype,"sortKey",2),C([l({type:String})],T.prototype,"sortDir",2),T=C([p("data-table")],T);var I=Object.defineProperty,E=Object.getOwnPropertyDescriptor,z=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?E(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&I(e,o,n),n};let O=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.selectedCount=0,this.showImport=!0,this.showExport=!0,this.showDelete=!0}_triggerImport(){const t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=t=>{const e=t.target.files?.[0];if(!e)return;const o=new FileReader;o.onload=()=>{this.dispatchEvent(new CustomEvent("batch-import",{detail:{content:o.result},bubbles:!0,composed:!0}))},o.readAsText(e)},t.click()}_triggerExport(){this.dispatchEvent(new CustomEvent("batch-export",{bubbles:!0,composed:!0}))}_triggerDelete(){this.dispatchEvent(new CustomEvent("batch-delete",{bubbles:!0,composed:!0}))}render(){return c`
      ${this.showImport?c`<button @click=${this._triggerImport}>${this._i18n.t("config.import")}</button>`:""}
      ${this.showExport?c`<button @click=${this._triggerExport} ?disabled=${0===this.selectedCount}>${this._i18n.t("config.export")}</button>`:""}
      ${this.showDelete?c`<button class="btn-delete" @click=${this._triggerDelete} ?disabled=${0===this.selectedCount}>${this._i18n.t("config.delete")}</button>`:""}
      ${this.selectedCount>0?c`<span class="count">${this._i18n.t("config.selected",{count:this.selectedCount})}</span>`:""}
    `}};O.styles=r`
    :host { display: flex; align-items: center; gap: 8px; }
    .count { font-size: 12px; color: #64748b; }
    button {
      padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
      cursor: pointer; border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s;
    }
    button:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
    button:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-delete:hover:not(:disabled) { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
  `,z([l({type:Number})],O.prototype,"selectedCount",2),z([l({type:Boolean})],O.prototype,"showImport",2),z([l({type:Boolean})],O.prototype,"showExport",2),z([l({type:Boolean})],O.prototype,"showDelete",2),O=z([p("batch-toolbar")],O);var j=Object.defineProperty,A=Object.getOwnPropertyDescriptor,R=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?A(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&j(e,o,n),n};let B=class extends d{constructor(){super(...arguments),this.open=!1,this.title="Confirm",this.message="Are you sure?",this.confirmLabel="Delete",this.cancelLabel="Cancel"}confirm(){this.open=!1,this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}cancel(){this.open=!1,this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?c`
      <div class="overlay" @click=${this.cancel}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <h3 class="title">${this.title}</h3>
          <p class="message">${this.message}</p>
          <div class="actions">
            <button @click=${this.cancel}>${this.cancelLabel}</button>
            <button class="btn-danger" @click=${this.confirm}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `:c``}};B.styles=r`
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4);
      z-index: 11000; display: flex; align-items: center; justify-content: center;
    }
    .dialog {
      background: #fff; border-radius: 12px; padding: 24px;
      max-width: 400px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .title { font-size: 16px; font-weight: 700; margin: 0 0 8px; color: #1e293b; }
    .message { color: #64748b; font-size: 13px; margin-bottom: 24px; line-height: 1.5; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; }
    button {
      padding: 8px 18px; border-radius: 6px; font-size: 13px; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s;
    }
    button:hover { background: #f1f5f9; }
    .btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
    .btn-danger:hover { background: #b91c1c; border-color: #b91c1c; }
  `,R([l({type:Boolean,reflect:!0})],B.prototype,"open",2),R([l({type:String})],B.prototype,"title",2),R([l({type:String})],B.prototype,"message",2),R([l({type:String})],B.prototype,"confirmLabel",2),R([l({type:String})],B.prototype,"cancelLabel",2),B=R([p("confirm-dialog")],B);var F=Object.defineProperty,U=Object.getOwnPropertyDescriptor,N=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?U(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&F(e,o,n),n};let P=class extends d{constructor(){super(...arguments),this.fields=[],this.mode="definition",this.readonly=!1,this.showDrag=!1}_notify(){this.dispatchEvent(new CustomEvent("fields-change",{detail:[...this.fields],bubbles:!0,composed:!0}))}_updateField(t,e,o){this.fields=this.fields.map(i=>i.id===t?{...i,[e]:o}:i),this._notify()}addRow(){this.fields=[...this.fields,{id:o(),name:"",selector:"",value:""}],this._notify()}copyRow(t){const e=this.fields.findIndex(e=>e.id===t);if(-1===e)return;const i=this.fields[e],s={...i,id:o(),name:i.name+" (copy)"},n=[...this.fields];n.splice(e+1,0,s),this.fields=n,this._notify()}deleteRow(t){this.fields=this.fields.filter(e=>e.id!==t),this._notify()}_onDragStart(t,e){t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",String(e))}_onDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="move"}_onDrop(t,e){t.preventDefault();const o=Number(t.dataTransfer.getData("text/plain"));if(isNaN(o)||o===e)return;const i=[...this.fields],[s]=i.splice(o,1);i.splice(e,0,s),this.fields=i,this._notify()}render(){const t="definition"===this.mode,e="value"===this.mode;return c`
      <div class="field-list">
        ${this.fields.map((o,i)=>c`
          <div class="field-row">
            ${this.showDrag?c`<span class="drag-handle" draggable="true" @dragstart=${t=>this._onDragStart(t,i)} @dragover=${this._onDragOver} @drop=${t=>this._onDrop(t,i)}>&#x2630;</span>`:""}
            ${t?c`
              <input placeholder="Field name" .value=${o.name} @input=${t=>this._updateField(o.id,"name",t.target.value)} ?readonly=${this.readonly} />
              <input placeholder="CSS selector" .value=${o.selector??""} @input=${t=>this._updateField(o.id,"selector",t.target.value)} ?readonly=${this.readonly} />
            `:""}
            ${e?c`
              <input placeholder="Field name" .value=${o.name} @input=${t=>this._updateField(o.id,"name",t.target.value)} ?readonly=${this.readonly} />
              <input placeholder="CSS selector" .value=${o.selector??""} @input=${t=>this._updateField(o.id,"selector",t.target.value)} ?readonly=${this.readonly} />
              <input placeholder="Value" .value=${o.value??""} @input=${t=>this._updateField(o.id,"value",t.target.value)} ?readonly=${this.readonly} />
            `:""}
            <div class="actions">
              <button class="row-btn" @click=${()=>this.copyRow(o.id)} title="Copy">&#x1F4CB;</button>
              <button class="row-btn danger" @click=${()=>this.deleteRow(o.id)} title="Delete">&times;</button>
            </div>
          </div>
        `)}
      </div>
      <button class="add-btn" @click=${()=>this.addRow()} ?disabled=${this.readonly}>+ Add field</button>
    `}};P.styles=r`
    :host { display: block; }
    .field-list { display: flex; flex-direction: column; gap: 8px; }
    .field-row { display: flex; gap: 8px; align-items: center; }
    .field-row input {
      flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-row input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    .field-row input.readonly { background: #f8fafc; color: #64748b; cursor: default; }
    .actions { display: flex; gap: 2px; flex-shrink: 0; }
    .row-btn {
      background: none; border: none; cursor: pointer; padding: 5px 7px; border-radius: 4px;
      font-size: 14px; color: #94a3b8; line-height: 1; transition: all 0.12s;
    }
    .row-btn:hover { background: #f1f5f9; color: #475569; }
    .row-btn.danger:hover { background: #fef2f2; color: #dc2626; }
    .add-btn {
      margin-top: 10px; padding: 7px; border: 2px dashed #e2e8f0; border-radius: 6px;
      background: none; cursor: pointer; font-size: 12px; color: #64748b; width: 100%;
      font-weight: 500; transition: all 0.12s;
    }
    .add-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .drag-handle { cursor: grab; color: #cbd5e1; user-select: none; font-size: 16px; flex-shrink: 0; }
    .drag-handle:active { cursor: grabbing; }
  `,N([l({type:Array})],P.prototype,"fields",2),N([l({type:String})],P.prototype,"mode",2),N([l({type:Boolean})],P.prototype,"readonly",2),N([l({type:Boolean})],P.prototype,"showDrag",2),P=N([p("dynamic-field-list")],P);var L=Object.defineProperty,M=Object.getOwnPropertyDescriptor,q=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?M(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&L(e,o,n),n};let V=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="definition",this.name="",this.description="",this.url="",this.fields=[],this.buttonName="",this.buttonSelector=""}_notify(){this.dispatchEvent(new CustomEvent("form-change",{detail:{name:this.name,description:this.description,url:this.url,fields:[...this.fields],buttonName:this.buttonName,buttonSelector:this.buttonSelector},bubbles:!0,composed:!0}))}_onInput(t,e){this[t]=e.target.value,this._notify()}_onFieldsChange(t){this.fields=t.detail,this._notify()}render(){const t="definition"===this.mode;return c`
      <div class="form">
        <div class="row">
          <div class="form-group">
            <label>${this._i18n.t("template.nameRequired")}</label>
            <input .value=${this.name} @input=${t=>this._onInput("name",t)} />
          </div>
          <div class="form-group">
            <label>${this._i18n.t("template.url")}</label>
            <input .value=${this.url} @input=${t=>this._onInput("url",t)} />
          </div>
        </div>

        <div class="form-group">
          <label>${this._i18n.t("template.description")}</label>
          <textarea .value=${this.description} @input=${t=>this._onInput("description",t)}></textarea>
        </div>

        <div class="section-title">
          ${t?this._i18n.t("template.formFields"):this._i18n.t("data.fields")}
        </div>
        <dynamic-field-list
          mode=${this.mode}
          .fields=${this.fields}
          @fields-change=${this._onFieldsChange}
        ></dynamic-field-list>

        <div class="section-title">${this._i18n.t("template.buttonConfig")}</div>
        <div class="row">
          <div class="form-group">
            <label>${this._i18n.t("template.buttonName")}</label>
            <input .value=${this.buttonName} @input=${t=>this._onInput("buttonName",t)} />
          </div>
          <div class="form-group">
            <label>${this._i18n.t("template.buttonSelector")}</label>
            <input .value=${this.buttonSelector} @input=${t=>this._onInput("buttonSelector",t)} />
          </div>
        </div>
      </div>
    `}};V.styles=r`
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    label { font-size: 12px; font-weight: 600; color: #475569; }
    input, textarea {
      padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus, textarea:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    textarea { resize: vertical; min-height: 64px; }
    .row { display: flex; gap: 12px; }
    .row > * { flex: 1; }
    .section-title {
      font-size: 12px; font-weight: 600; color: #475569;
      padding-top: 16px; border-top: 1px solid #f1f5f9;
    }
    .field-label-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 600; color: #475569;
      padding-top: 16px; border-top: 1px solid #f1f5f9;
    }
    .field-label-row span:last-child { color: #94a3b8; font-weight: 400; }
  `,q([l({type:String})],V.prototype,"mode",2),q([l({type:String})],V.prototype,"name",2),q([l({type:String})],V.prototype,"description",2),q([l({type:String})],V.prototype,"url",2),q([l({type:Array})],V.prototype,"fields",2),q([l({type:String})],V.prototype,"buttonName",2),q([l({type:String})],V.prototype,"buttonSelector",2),V=q([p("form-config")],V);var Y=Object.defineProperty,K=Object.getOwnPropertyDescriptor,H=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?K(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&Y(e,o,n),n};let J=class extends d{constructor(){super(...arguments),this.open=!1,this.title="",this.size="medium",this._onKeyDown=t=>{"Escape"===t.key&&this.close()}}close(){this.open=!1,this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown)}render(){return this.open?c`
      <div class="overlay">
        <div class="dialog ${this.size}">
          <div class="header">
            <h3 class="title">${this.title}</h3>
            <button class="close-btn" @click=${()=>this.close()}>&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `:c``}};J.styles=r`
    :host { display: none; }
    :host([open]) { display: block; }
    .overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      padding: 24px;
      animation: fadeIn 0.15s ease;
    }
    .dialog {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      width: 100%;
      max-height: 85vh;
      display: flex; flex-direction: column;
      animation: slideUp 0.2s ease;
    }
    .dialog.small { max-width: 420px; }
    .dialog.medium { max-width: 560px; }
    .dialog.large { max-width: 720px; }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 24px; border-bottom: 1px solid #e2e8f0;
    }
    .title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
    .close-btn {
      background: none; border: none; font-size: 22px; cursor: pointer;
      color: #94a3b8; padding: 0; line-height: 1; width: 28px; height: 28px;
      border-radius: 6px; display: flex; align-items: center; justify-content: center;
    }
    .close-btn:hover { background: #f1f5f9; color: #475569; }
    .body { padding: 24px; overflow-y: auto; flex: 1; }
    .footer {
      padding: 14px 24px; border-top: 1px solid #e2e8f0;
      display: flex; justify-content: flex-end; gap: 8px;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  `,H([l({type:Boolean,reflect:!0})],J.prototype,"open",2),H([l({type:String})],J.prototype,"title",2),H([l({type:String})],J.prototype,"size",2),J=H([p("modal-dialog")],J);var Q=Object.defineProperty,W=Object.getOwnPropertyDescriptor,G=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?W(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&Q(e,o,n),n};let X=null,Z=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="add",this.data={},this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""}}open(t){t?(this.data={...t},this._formData={name:t.name,description:t.description,url:t.url,fields:t.fields.map(t=>({id:t.id,name:t.name,selector:t.selector,value:""})),buttonName:t.button?.name??"",buttonSelector:t.button?.selector??""}):this._formData=X?{...X,fields:[...X.fields]}:{name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""},this.requestUpdate();const e=this.renderRoot.querySelector("#modal");e&&(e.open=!0)}close(){"add"===this.mode&&this._saveDraft();const t=this.renderRoot.querySelector("#modal");t&&(t.open=!1),this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}_onFormChange(t){this._formData=t.detail,this.requestUpdate()}_submit(){const t=this._formData;if(!t.name.trim())return;const e=t.fields.filter(t=>t.name.trim()).map(t=>({id:t.id,name:t.name.trim(),selector:t.selector?.trim()??""})),o=t.buttonSelector.trim()?{name:t.buttonName.trim()||"Submit",selector:t.buttonSelector.trim()}:void 0;this.dispatchEvent(new CustomEvent("template-submit",{detail:{name:t.name.trim(),description:t.description.trim(),url:t.url.trim(),fields:e,button:o},bubbles:!0,composed:!0})),this._clearDraft(),this.close()}_saveDraft(){X={...this._formData,fields:[...this._formData.fields]}}_clearDraft(){X=null}render(){const t="edit"===this.mode?this._i18n.t("template.edit"):"copy"===this.mode?this._i18n.t("template.copy"):"extract"===this.mode?this._i18n.t("template.extract"):this._i18n.t("template.new");return c`
      <modal-dialog id="modal" title=${t} size="large" @modal-close=${this.close}>
        <form-config
          mode="definition"
          .name=${this._formData.name}
          .description=${this._formData.description}
          .url=${this._formData.url}
          .fields=${this._formData.fields}
          .buttonName=${this._formData.buttonName}
          .buttonSelector=${this._formData.buttonSelector}
          @form-change=${this._onFormChange}
        ></form-config>
        <div slot="footer">
          <button class="btn-cancel" @click=${this.close}>${this._i18n.t("config.cancel")}</button>
          <button class="btn-primary" @click=${this._submit} ?disabled=${!this._formData.name.trim()}>${this._i18n.t("config.save")}</button>
        </div>
      </modal-dialog>
    `}};Z.styles=r`
    .btn-primary {
      padding: 8px 20px; border-radius: 6px; background: #2563eb; color: #fff;
      border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-cancel {
      padding: 8px 20px; border-radius: 6px; background: #fff; color: #475569;
      border: 1px solid #e2e8f0; cursor: pointer; font-size: 13px; transition: background 0.15s;
    }
    .btn-cancel:hover { background: #f1f5f9; }
  `,G([l({type:String})],Z.prototype,"mode",2),G([l({type:Object})],Z.prototype,"data",2),Z=G([p("template-modal")],Z);var tt=Object.defineProperty,et=Object.getOwnPropertyDescriptor,ot=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?et(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&tt(e,o,n),n};let it=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._templates=new i(this,w,!0),this._searchQuery="",this._selectedIds=[],this._deleteTarget=[]}get _columns(){return[{key:"name",label:this._i18n.t("template.name"),sortable:!0,width:"160px"},{key:"url",label:this._i18n.t("template.url"),sortable:!1,width:"240px"},{key:"description",label:this._i18n.t("template.description"),sortable:!1}]}get _actions(){return[{key:"edit",label:this._i18n.t("config.edit")},{key:"copy",label:this._i18n.t("config.copy")},{key:"delete",label:this._i18n.t("config.delete")},{key:"export",label:this._i18n.t("config.export")}]}get _filtered(){return v(this._templates.state,this._searchQuery,["name","description","url"])}_onSearch(t){this._searchQuery=t.detail.value,this.requestUpdate()}_onSelection(t){this._selectedIds=t.detail,this.requestUpdate()}_onRowAction(t){const{action:e,row:o}=t.detail,i=o;switch(e){case"edit":this._editData=i,this._modal.mode="edit",this._modal.open(i);break;case"copy":this._editData=void 0,this._modal.mode="copy",this._modal.open({...i,name:i.name+" (Copy)"});break;case"delete":this._deleteTarget=[i.id],this._confirm.title=this._i18n.t("template.deleteTitle"),this._confirm.message=this._i18n.t("template.deleteMsg",{name:i.name}),this._confirm.open=!0;break;case"export":this._exportSelection([i.id])}}async _onConfirm(){if(this._deleteTarget.length){const t=this._deleteTarget.length;await w.deleteMany(this._deleteTarget),this._deleteTarget=[],this._selectedIds=[];const{showToast:e}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));e(this._i18n.t("template.deleted",{count:t}),"success")}this.requestUpdate()}async _onTemplateSubmit(t){const e=t.detail;this._editData?await w.update(this._editData.id,e):await w.add(e),this._editData=void 0}_onBatchExport(){this._exportSelection(this._selectedIds)}_exportSelection(t){k(this._templates.state.filter(e=>t.includes(e.id)),"templates")}async _onBatchImport(t){try{const e=$(t.detail.content),o=await w.importFrom(e),{showToast:i}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));i(this._i18n.t("template.imported",{count:o}),"success")}catch{const{showToast:t}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));t(this._i18n.t("template.importFailed"),"error")}}_onBatchDelete(){this._deleteTarget=[...this._selectedIds],this._confirm.title=this._i18n.t("template.deleteBatchTitle"),this._confirm.message=this._i18n.t("template.deleteBatchMsg",{count:this._deleteTarget.length}),this._confirm.open=!0}_openAdd(){this._editData=void 0,this._modal.mode="add",this._modal.open()}render(){const t=this._filtered;return c`
      <div class="top-row">
        <div class="top-row-left">
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t("template.new")}</button>
          <batch-toolbar
            .selectedCount=${this._selectedIds.length}
            @batch-export=${this._onBatchExport}
            @batch-import=${this._onBatchImport}
            @batch-delete=${this._onBatchDelete}
          ></batch-toolbar>
        </div>
        <search-bar placeholder=${this._i18n.t("config.searchTemplates")} @search-change=${this._onSearch}></search-bar>
      </div>
      <data-table
        .columns=${this._columns}
        .rows=${t}
        .selectedIds=${this._selectedIds}
        .rowActions=${this._actions}
        .actionsHeader=${this._i18n.t("config.actions")}
        @selection-change=${this._onSelection}
        @row-action=${this._onRowAction}
      >
        <div slot="empty" style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <span>${this._i18n.t("config.noTemplates")}</span>
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t("template.new")}</button>
        </div>
      </data-table>
      <template-modal @template-submit=${this._onTemplateSubmit}></template-modal>
      <confirm-dialog @confirm=${this._onConfirm}></confirm-dialog>
    `}};it.styles=r`
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
  `,ot([h("template-modal")],it.prototype,"_modal",2),ot([h("confirm-dialog")],it.prototype,"_confirm",2),it=ot([p("template-management")],it);var st=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,at=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?nt(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&st(e,o,n),n};let rt=null,lt=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="add",this._templates=new i(this,w,!0),this._selectedTemplateId="",this._restoring=!1,this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""}}open(t){if(this._selectedTemplateId="",t){this._selectedTemplateId=t.templateId;const e=w.getById(t.templateId);this._formData={name:t.name,description:t.description||e?.description||"",url:t.url,fields:this._buildValueFields(t.templateId,t.values),buttonName:t.buttonName??"",buttonSelector:t.buttonSelector??""}}else rt?(this._restoring=!0,this._selectedTemplateId=rt.templateId,this._formData={name:rt.name,description:rt.description,url:rt.url,fields:[...rt.fields],buttonName:rt.buttonName,buttonSelector:rt.buttonSelector}):this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""};this.requestUpdate();const e=this.renderRoot.querySelector("#modal");e&&(e.open=!0)}updated(t){super.updated(t),this._restoring=!1}_buildValueFields(t,e){const o=Array.isArray(e)?e:Object.entries(e).map(([t,e])=>({name:t,selector:"",value:e})),i=w.getById(t);return i?i.fields.map(t=>{const e=o.find(e=>e.name===t.name)??o.find(e=>e.selector===t.selector);return{id:t.id,name:t.name,selector:t.selector,value:e?.value??""}}):o.map(t=>({id:crypto.randomUUID(),...t}))}close(){"add"===this.mode&&this._saveDraft();const t=this.renderRoot.querySelector("#modal");t&&(t.open=!1),this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}_onTemplateChange(t){if(this._restoring)return;const e=t.target.value;if(this._selectedTemplateId=e,!e)return this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""},void this.requestUpdate();const o=w.getById(e);o&&(this._formData={name:this._formData.name||o.name,description:o.description,url:this._formData.url||o.url,fields:o.fields.map(t=>({id:t.id,name:t.name,selector:t.selector,value:""})),buttonName:this._formData.buttonName||o.button?.name||"",buttonSelector:this._formData.buttonSelector||o.button?.selector||""},this.requestUpdate())}_onFormChange(t){this._formData=t.detail,this.requestUpdate()}_saveDraft(){rt={...this._formData,fields:[...this._formData.fields],templateId:this._selectedTemplateId}}_submit(){const t=this._formData;if(!t.name.trim())return;const e=t.fields.map(t=>({name:t.name,selector:t.selector??"",value:(t.value??"").trim()}));this.dispatchEvent(new CustomEvent("data-submit",{detail:{name:t.name.trim(),description:t.description.trim(),url:t.url.trim(),templateId:this._selectedTemplateId,values:e,buttonName:t.buttonName.trim()||void 0,buttonSelector:t.buttonSelector.trim()||void 0},bubbles:!0,composed:!0})),this._clearDraft(),this.close()}_clearDraft(){rt=null}render(){const t=this._templates.state,e="edit"===this.mode?this._i18n.t("data.edit"):"copy"===this.mode?this._i18n.t("data.copy"):this._i18n.t("data.new");return c`
      <modal-dialog id="modal" title=${e} size="large" @modal-close=${this.close}>
        <div class="form-group">
          <label>${this._i18n.t("data.selectTemplate")}</label>
          <select @change=${this._onTemplateChange}>
            <option value="" ?selected=${!this._selectedTemplateId}>${this._i18n.t("data.manual")}</option>
            ${t.map(t=>c`<option value=${t.id} ?selected=${this._selectedTemplateId===t.id}>${t.name}</option>`)}
          </select>
        </div>

        <form-config
          mode="value"
          .name=${this._formData.name}
          .description=${this._formData.description}
          .url=${this._formData.url}
          .fields=${this._formData.fields}
          .buttonName=${this._formData.buttonName}
          .buttonSelector=${this._formData.buttonSelector}
          @form-change=${this._onFormChange}
        ></form-config>

        <div slot="footer" style="margin-top:16px">
          <button class="btn-cancel" @click=${this.close}>${this._i18n.t("config.cancel")}</button>
          <button class="btn-primary" @click=${this._submit} ?disabled=${!this._formData.name.trim()}>${this._i18n.t("config.save")}</button>
        </div>
      </modal-dialog>
    `}};lt.styles=r`
    .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
    label { font-size: 12px; font-weight: 600; color: #475569; }
    select {
      padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none; box-sizing: border-box; color: #1e293b; background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    select:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
    .btn-primary {
      padding: 8px 20px; border-radius: 6px; background: #2563eb; color: #fff;
      border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-cancel {
      padding: 8px 20px; border-radius: 6px; background: #fff; color: #475569;
      border: 1px solid #e2e8f0; cursor: pointer; font-size: 13px; transition: background 0.15s;
    }
    .btn-cancel:hover { background: #f1f5f9; }
  `,at([l({type:String})],lt.prototype,"mode",2),lt=at([p("data-wizard")],lt);var dt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,pt=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?ct(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&dt(e,o,n),n};let ht=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._records=new i(this,s,!0),this._searchQuery="",this._selectedIds=[],this._deleteTarget=[]}get _columns(){return[{key:"name",label:this._i18n.t("template.name"),sortable:!0,width:"160px"},{key:"url",label:this._i18n.t("template.url"),sortable:!1,width:"240px"},{key:"description",label:this._i18n.t("template.description"),sortable:!1}]}get _actions(){return[{key:"edit",label:this._i18n.t("config.edit")},{key:"copy",label:this._i18n.t("config.copy")},{key:"delete",label:this._i18n.t("config.delete")},{key:"extract",label:this._i18n.t("data.extractTemplate")},{key:"export",label:this._i18n.t("config.export")}]}get _filtered(){return v(this._records.state,this._searchQuery,["name","url"])}_onSearch(t){this._searchQuery=t.detail.value,this.requestUpdate()}_onSelection(t){this._selectedIds=t.detail,this.requestUpdate()}_onRowAction(t){const{action:e,row:o}=t.detail,i=o;switch(e){case"edit":this._editData=i,this._wizard.mode="edit",this._wizard.open(i);break;case"copy":this._wizard.mode="copy",this._wizard.open({...i,name:i.name+" (Copy)"});break;case"delete":this._deleteTarget=[i.id],this._confirm.title=this._i18n.t("data.deleteTitle"),this._confirm.message=this._i18n.t("data.deleteMsg",{name:i.name}),this._confirm.open=!0;break;case"extract":{const t=w.getById(i.templateId),e=i.values.length>0?i.values.map(t=>({id:t.name,name:t.name,selector:t.selector})):(t?.fields??[]).map(t=>({id:t.id,name:t.name,selector:t.selector})),o={id:"",name:i.name,description:i.description||t?.description||"",url:i.url,fields:e,button:i.buttonSelector?{name:i.buttonName||"",selector:i.buttonSelector}:void 0,createdAt:Date.now(),updatedAt:Date.now()};this._tmodal.mode="extract",this._tmodal.open(o);break}case"export":this._exportSelection([i.id])}}async _onConfirm(){if(this._deleteTarget.length){const t=this._deleteTarget.length;await s.deleteMany(this._deleteTarget),this._deleteTarget=[],this._selectedIds=[];const{showToast:e}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));e(this._i18n.t("data.deleted",{count:t}),"success"),this.requestUpdate()}}async _onDataSubmit(t){const e=t.detail;this._editData?await s.update(this._editData.id,e):await s.add(e),this._editData=void 0}async _onExtractSubmit(t){const e=t.detail;await w.add(e);const{showToast:o}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));o(this._i18n.t("data.templateExtracted"),"success")}_onBatchExport(){this._exportSelection(this._selectedIds)}_exportSelection(t){k(this._records.state.filter(e=>t.includes(e.id)),"data-records")}async _onBatchImport(t){try{const e=$(t.detail.content),o=await s.importFrom(e),{showToast:i}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));i(this._i18n.t("data.imported",{count:o}),"success")}catch{const{showToast:t}=await y(async()=>{const{showToast:t}=await import("./toast-notification-k-5Jv9PO.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));t(this._i18n.t("data.importFailed"),"error")}}_onBatchDelete(){this._deleteTarget=[...this._selectedIds],this._confirm.title=this._i18n.t("data.deleteBatchTitle"),this._confirm.message=this._i18n.t("data.deleteBatchMsg",{count:this._deleteTarget.length}),this._confirm.open=!0}_openAdd(){this._editData=void 0,this._wizard.mode="add",this._wizard.open()}render(){const t=this._filtered;return c`
      <div class="top-row">
        <div class="top-row-left">
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t("data.new")}</button>
          <batch-toolbar
            .selectedCount=${this._selectedIds.length}
            @batch-export=${this._onBatchExport}
            @batch-import=${this._onBatchImport}
            @batch-delete=${this._onBatchDelete}
          ></batch-toolbar>
        </div>
        <search-bar placeholder=${this._i18n.t("config.searchData")} @search-change=${this._onSearch}></search-bar>
      </div>
      <data-table
        .columns=${this._columns}
        .rows=${t}
        .selectedIds=${this._selectedIds}
        .rowActions=${this._actions}
        .actionsHeader=${this._i18n.t("config.actions")}
        @selection-change=${this._onSelection}
        @row-action=${this._onRowAction}
      >
        <div slot="empty" style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <span>${this._i18n.t("config.noData")}</span>
          <button class="add-btn" @click=${this._openAdd}>+ ${this._i18n.t("data.new")}</button>
        </div>
      </data-table>
      <data-wizard @data-submit=${this._onDataSubmit}></data-wizard>
      <template-modal @template-submit=${this._onExtractSubmit}></template-modal>
      <confirm-dialog @confirm=${this._onConfirm}></confirm-dialog>
    `}};ht.styles=r`
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
  `,pt([h("data-wizard")],ht.prototype,"_wizard",2),pt([h("confirm-dialog")],ht.prototype,"_confirm",2),pt([h("template-modal")],ht.prototype,"_tmodal",2),ht=pt([p("data-management")],ht);var gt=Object.getOwnPropertyDescriptor;let ut=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._settings=new i(this,n)}connectedCallback(){super.connectedCallback(),this._settings.load()}_toggle(t){const e=t.target.checked;n.setCookieCopyEnabled(e)}render(){const t=this._settings.state.cookieCopyEnabled;return c`
      <div class="section">
        <h3 class="section-title">${this._i18n.t("cookie.title")}</h3>

        <div class="toggle-row">
          <label class="switch">
            <input type="checkbox" .checked=${t} @change=${this._toggle} />
            <span class="slider"></span>
          </label>
          <div>
            <div class="toggle-label">${this._i18n.t("cookie.enable")}</div>
            <div class="toggle-desc">${this._i18n.t("cookie.enableDesc")}</div>
          </div>
        </div>

        <div class="kb-box">
          <h4>${this._i18n.t("cookie.howtoTitle")}</h4>
          <div class="kb-row">
            <span class="kb-key">Ctrl + C</span>
            <span class="kb-desc">${this._i18n.t("cookie.howtoCopy")}</span>
          </div>
          <div class="kb-row">
            <span class="kb-key">Ctrl + V</span>
            <span class="kb-desc">${this._i18n.t("cookie.howtoPaste")}</span>
          </div>
          <div class="kb-row">
            <span class="kb-key">Ctrl + D</span>
            <span class="kb-desc">${this._i18n.t("cookie.howtoClear")}</span>
          </div>
        </div>

        <div class="disclaimer">
          <h4>${this._i18n.t("cookie.disclaimerTitle")}</h4>
          <ul>
            <li>${this._i18n.t("cookie.disclaimer1")}</li>
            <li>${this._i18n.t("cookie.disclaimer2")}</li>
            <li>${this._i18n.t("cookie.disclaimer3")}</li>
            <li>${this._i18n.t("cookie.disclaimer4")}</li>
          </ul>
        </div>
      </div>
    `}};ut.styles=r`
    :host { display: block; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 12px;
    }

    .toggle-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
      margin-bottom: 16px;
    }
    .toggle-label { font-size: 14px; font-weight: 500; color: #1e293b; }
    .toggle-desc { font-size: 12px; color: #64748b; margin-top: 2px; }

    .switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; inset: 0; background: #cbd5e1;
      border-radius: 22px; cursor: pointer; transition: background 0.2s;
    }
    .slider::before {
      content: ''; position: absolute;
      height: 16px; width: 16px; left: 3px; top: 3px;
      background: #fff; border-radius: 50%;
      transition: transform 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
    input:checked + .slider { background: #22c55e; }
    input:checked + .slider::before { transform: translateX(18px); }

    .disclaimer {
      background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;
      padding: 14px 16px;
    }
    .disclaimer h4 {
      font-size: 13px; font-weight: 600; color: #92400e; margin: 0 0 8px;
    }
    .disclaimer ul {
      margin: 0; padding: 0 0 0 18px;
      font-size: 12px; color: #78350f; line-height: 1.7;
    }
    .disclaimer li { margin-bottom: 2px; }

    .kb-box {
      background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
      padding: 14px 16px; margin-bottom: 16px;
    }
    .kb-box h4 {
      font-size: 13px; font-weight: 600; color: #166534; margin: 0 0 10px;
    }
    .kb-row {
      display: flex; align-items: center; gap: 12px; margin-bottom: 6px;
      font-size: 13px; color: #14532d;
    }
    .kb-key {
      display: inline-flex; align-items: center; gap: 4px;
      background: #fff; border: 1px solid #d1d5db; border-radius: 4px;
      padding: 2px 8px; font-size: 12px; font-weight: 600;
      color: #374151; white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
      box-shadow: 0 1px 0 rgba(0,0,0,0.08);
      min-width: 60px; justify-content: center;
    }
    .kb-desc { color: #166534; }
  `,ut=((t,e,o,i)=>{for(var s,n=i>1?void 0:i?gt(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=s(n)||n);return n})([p("cookie-settings")],ut);var bt=Object.getOwnPropertyDescriptor;const ft={zh:{title:"用户指南",tocTitle:"目录",intro:"表单管理是一款 Chrome 浏览器扩展，提供两大核心功能：<strong>表单自动填充</strong>和<strong>Cookie 跨域复制</strong>。",pages:[{id:"popup",title:"弹窗页",sections:[{id:"popup-overview",title:"界面概览",body:c`
            <p>点击浏览器工具栏的扩展图标即可打开弹窗。从上到下分为三个区域：</p>
            <ul>
              <li><strong>搜索栏</strong> — 按名称或网址过滤数据卡片。</li>
              <li><strong>工具栏</strong> — 宽度选择器（400 / 600 / 800px）、语言切换按钮、"配置"按钮（打开完整的配置管理页面）。</li>
              <li><strong>卡片区</strong> — 每条数据以卡片展示，显示名称和一个"URL"按钮（点击跳转到记录中的网址）。</li>
            </ul>
            <p><strong>卡片匹配规则：</strong>打开弹窗时，扩展将当前页面网址与每条数据的 URL 做<em>包含匹配</em>。匹配的卡片显示<span style="color:#16a34a;font-weight:600;">绿色边框</span>并排在最前面，点击触发自动填充；不匹配的卡片以 50% 透明度排在后面，点击无效果。</p>
            <p><strong>拖拽排序：</strong>匹配卡片左侧有拖拽手柄（☰），拖动可调整卡片顺序，排序结果自动保存。</p>
          `},{id:"popup-autofill",title:"自动填充",body:c`
            <p>在匹配的卡片上<strong>点击</strong>即可触发。扩展将数据记录中的字段值逐一填入页面表单。</p>
            <p><strong>元素匹配策略：</strong></p>
            <ul>
              <li><strong>优先按 CSS 选择器</strong> — 使用模板中定义的 CSS 选择器精确定位页面元素。</li>
              <li><strong>按名称回退</strong> — 选择器未命中时，依次尝试 <code>input[name="字段名"]</code>、<code>#字段名</code>（ID 匹配）、placeholder、关联 &lt;label&gt; 文本、aria-label。</li>
            </ul>
            <p><strong>框架兼容：</strong>填充后触发 <code>input</code>、<code>change</code>、<code>blur</code> 事件，React、Vue 等框架可正确响应。</p>
            <p><strong>复选框 / 单选框：</strong>值设为 <code>true</code>、<code>1</code> 或 <code>on</code> 会将其选中。</p>
            <p><strong>按钮自动点击：</strong>如果配置了按钮选择器，字段填充完成后自动点击（常用于提交表单）。</p>
            <p>填充结果通过通知提示，如"已填充 5/5 个字段。按钮已点击！"。</p>
          `},{id:"popup-cookie",title:"Cookie 快捷键",body:c`
            <p>弹窗中支持三个全局快捷键（输入框聚焦时自动禁用）：</p>
            <table class="shortcut-table">
              <tr><td><kbd>Ctrl+C</kbd></td><td>复制当前页面所有 Cookie + localStorage + sessionStorage。</td></tr>
              <tr><td><kbd>Ctrl+V</kbd></td><td>清空当前页面 Cookie → 写入快照 → 刷新页面。粘贴后快照自动清除（一次性操作）。</td></tr>
              <tr><td><kbd>Ctrl+D</kbd></td><td>清空当前页面所有 Cookie 并刷新。</td></tr>
            </table>
            <p><strong>使用前提：</strong>此功能默认关闭，需先在配置页 → Cookie 标签页手动开启。</p>
            <div class="warning-box">
              <strong>⚠ 重要提醒：</strong>此功能会复制来源域名的全部 Cookie 到目标域名，可能导致会话冲突或认证异常。仅供开发/测试使用，请勿在生产环境未经授权使用。
            </div>
          `}]},{id:"config",title:"配置页",sections:[{id:"config-data",title:"数据 Tab",body:c`
            <p>数据记录保存了要填充到表单中的<strong>实际值</strong>。每条数据包含名称、网址、以及字段值列表。</p>
            <p><strong>创建数据有两种方式：</strong></p>
            <ol>
              <li><strong>基于模板</strong> — 在向导中选择已有模板，扩展自动加载字段结构，只需填入各字段的值。模板的网址和描述也会自动带入。</li>
              <li><strong>手动填写</strong> — 不依赖模板，自行定义字段名和值。适合快速测试或无模板可用的场景。</li>
            </ol>
            <p>向导支持<strong>草稿保存</strong>：新建模式下误关弹窗，内容不会丢失，重新打开自动恢复。</p>
            <p>每条数据支持的操作：<strong>编辑、复制、删除、导出 JSON、提取模板</strong>。"提取模板"可根据已有数据逆向生成模板。</p>
          `},{id:"config-template",title:"模板 Tab",body:c`
            <p>模板定义了表单字段的<strong>结构</strong>，告诉扩展"页面上有哪些字段、各自在哪里"。</p>
            <p>每个模板包含：</p>
            <ul>
              <li><strong>名称</strong> — 模板的标识名。</li>
              <li><strong>网址</strong> — 目标页面地址，用于弹窗匹配判定。</li>
              <li><strong>字段列表</strong> — 每个字段定义：
                <ul>
                  <li><strong>字段名称</strong>：用于在数据中标识该字段。</li>
                  <li><strong>CSS 选择器</strong>：定位页面表单元素，如 <code>#username</code>、<code>input[name="email"]</code>。</li>
                </ul>
              </li>
              <li><strong>按钮配置（可选）</strong> — 按钮名称 + CSS 选择器，填充后自动点击，常用于提交表单。</li>
            </ul>
            <p><strong>获取 CSS 选择器：</strong>在目标网页右键输入框 → 检查 → DevTools Elements 面板中右键元素 → Copy → Copy selector。建议精简为 <code>#id</code> 或 <code>[name="xxx"]</code>，避免超长层级选择器。</p>
            <p>支持操作：<strong>新建、编辑、复制、删除、导出 JSON、从数据提取模板</strong>。</p>
          `},{id:"config-cookie",title:"Cookie Tab",body:c`
            <p>管理 Cookie 跨域复制功能的<strong>开关</strong>。</p>
            <ul>
              <li><strong>功能开关</strong> — 开启后弹窗中的 Ctrl+C/V/D 快捷键生效，关闭后无响应。</li>
              <li><strong>快捷键参考</strong> — 列出三个快捷键及作用。</li>
              <li><strong>免责声明</strong> — 说明复制范围（包括 HttpOnly Cookie 和所有父级域名）、风险（会话冲突）、适用场景（仅供开发/测试）。</li>
            </ul>
            <p>粘贴 Cookie 时，path 非 <code>/</code> 的 Cookie 会自动额外创建 <code>path=/</code> 的副本，确保在目标域名所有路径下正确发送。</p>
          `},{id:"config-batch",title:"批量操作",body:c`
            <p>在数据或模板管理页面勾选表格行复选框进入批量模式，工具栏显示已选数量并提供三个按钮：</p>
            <ul>
              <li><strong>导入</strong> — 选择 .json 文件批量导入，重复 ID 自动跳过。</li>
              <li><strong>导出</strong> — 选中项导出为 <code>data-records-YYYY-MM-DD.json</code> 或 <code>templates-YYYY-MM-DD.json</code>。</li>
              <li><strong>批量删除</strong> — 确认后一次性删除所有选中项，不可撤销。</li>
            </ul>
            <p>每行操作列也有单独的<strong>导出</strong>按钮，可导出单条记录。</p>
          `}]}],tips:{id:"tips",title:"注意事项与技巧",body:c`
      <ul>
        <li><strong>CSS 选择器越简单越好。</strong>优先使用 <code>#id</code> 或 <code>[name="xxx"]</code>，避免超长层级选择器。</li>
        <li><strong>URL 匹配是包含关系。</strong>数据 URL 设为 <code>example.com/login</code> 即可匹配该域名下所有登录页变体。</li>
        <li><strong>Cookie 功能默认关闭。</strong>出于安全考虑，安装后需手动在 Cookie Tab 中开启。</li>
        <li><strong>修改即时生效。</strong>所有增删改操作立即生效，无需重启扩展或刷新页面。</li>
        <li><strong>弹窗宽度可调。</strong>在弹窗工具栏切换 400/600/800px，卡片列数自动适配。</li>
        <li><strong>拖拽排序持久化。</strong>卡片顺序自动保存，下次打开保持一致。</li>
        <li><strong>误关弹窗不丢内容。</strong>新建数据/模板时关闭弹窗，重新打开自动恢复草稿。</li>
        <li><strong>选择器失效有回退。</strong>CSS 选择器未命中时扩展会按字段名自动回退匹配。</li>
      </ul>
    `}},en:{title:"User Guide",tocTitle:"Contents",intro:"Form Manage is a Chrome extension with two core features: <strong>Form Auto-fill</strong> and <strong>Cross-domain Cookie Copy</strong>.",pages:[{id:"popup",title:"Popup",sections:[{id:"popup-overview",title:"Interface Overview",body:c`
            <p>Click the extension icon in the browser toolbar to open the popup. Three areas from top to bottom:</p>
            <ul>
              <li><strong>Search bar</strong> — Filter data cards by name or URL.</li>
              <li><strong>Toolbar</strong> — Width selector (400 / 600 / 800px), language toggle, and a "Configure" button that opens the full config page.</li>
              <li><strong>Card grid</strong> — Each data record shown as a card with its name and a "URL" button (opens the record's URL in a new tab).</li>
            </ul>
            <p><strong>Card matching:</strong> When the popup opens, the extension checks if the current page URL <em>contains</em> each data record's URL. Matched cards show a <span style="color:#16a34a;font-weight:600;">green border</span> and appear first — clicking triggers auto-fill. Unmatched cards are dimmed at 50% opacity; clicking has no effect.</p>
            <p><strong>Drag to reorder:</strong> Matched cards have a drag handle (☰) on the left. Drag to reorder — the order is saved automatically.</p>
          `},{id:"popup-autofill",title:"Auto-fill",body:c`
            <p><strong>Click</strong> a matched card to trigger auto-fill. The extension fills each field value into the corresponding form element.</p>
            <p><strong>Element matching strategy:</strong></p>
            <ul>
              <li><strong>CSS selector first</strong> — Uses the selector defined in the template for precise lookup.</li>
              <li><strong>Name fallback</strong> — If the selector fails, tries: <code>input[name="fieldName"]</code>, <code>#fieldName</code> (ID match), placeholder, associated &lt;label&gt; text, and aria-label.</li>
            </ul>
            <p><strong>Framework compatibility:</strong> Dispatches <code>input</code>, <code>change</code>, and <code>blur</code> events after filling so React, Vue, and other frameworks detect the changes.</p>
            <p><strong>Checkboxes / radio buttons:</strong> Setting the value to <code>true</code>, <code>1</code>, or <code>on</code> checks them.</p>
            <p><strong>Auto-click button:</strong> If a button selector is configured, it is clicked after all fields are filled (useful for submitting forms).</p>
            <p>Results are shown via toast, e.g. "Filled 5/5 fields. Button clicked!".</p>
          `},{id:"popup-cookie",title:"Cookie Shortcuts",body:c`
            <p>Three global shortcuts in the popup (automatically suppressed when an input is focused):</p>
            <table class="shortcut-table">
              <tr><td><kbd>Ctrl+C</kbd></td><td>Copy all cookies + localStorage + sessionStorage from the current page.</td></tr>
              <tr><td><kbd>Ctrl+V</kbd></td><td>Clear current page cookies → write saved snapshot → reload page. Snapshot is cleared after pasting (one-shot).</td></tr>
              <tr><td><kbd>Ctrl+D</kbd></td><td>Clear all cookies on the current page and reload.</td></tr>
            </table>
            <p><strong>Prerequisite:</strong> This feature is disabled by default. Enable it in Config → Cookie tab first.</p>
            <div class="warning-box">
              <strong>⚠ Important:</strong> This copies ALL cookies from the source domain to the target domain, which may cause session conflicts or authentication issues. For development/testing only. Do not use on production systems without authorization.
            </div>
          `}]},{id:"config",title:"Config Page",sections:[{id:"config-data",title:"Data Tab",body:c`
            <p>Data records contain the <strong>actual values</strong> to fill into forms. Each record has a name, URL, and a list of field values.</p>
            <p><strong>Two ways to create data:</strong></p>
            <ol>
              <li><strong>From a template</strong> — Select an existing template in the wizard. The field structure is loaded automatically; you just fill in values. The template's URL and description are also copied.</li>
              <li><strong>Manual entry</strong> — Define field names and values yourself, without a template. Useful for quick tests.</li>
            </ol>
            <p>The wizard supports <strong>draft saving</strong>: closing the modal without saving preserves your content, restored on next open.</p>
            <p>Row actions: <strong>Edit, Copy, Delete, Export JSON, Extract Template</strong>. "Extract Template" reverse-engineers a template from the data record.</p>
          `},{id:"config-template",title:"Template Tab",body:c`
            <p>Templates define the <strong>structure</strong> of form fields — telling the extension what fields exist and where.</p>
            <p>Each template contains:</p>
            <ul>
              <li><strong>Name</strong> — A label for the template.</li>
              <li><strong>URL</strong> — Target page address, used for card matching in the popup.</li>
              <li><strong>Field list</strong> — Each field defines:
                <ul>
                  <li><strong>Field name</strong>: used to identify the field in data records.</li>
                  <li><strong>CSS selector</strong>: locates the form element, e.g. <code>#username</code>, <code>input[name="email"]</code>.</li>
                </ul>
              </li>
              <li><strong>Button config (optional)</strong> — Button name + CSS selector. Clicked automatically after filling.</li>
            </ul>
            <p><strong>Getting CSS selectors:</strong> Right-click an input → Inspect → In DevTools, right-click the element → Copy → Copy selector. Simplify to <code>#id</code> or <code>[name="xxx"]</code> — long hierarchical selectors break easily.</p>
            <p>Actions: <strong>Create, Edit, Copy, Delete, Export JSON, Extract Template from Data</strong>.</p>
          `},{id:"config-cookie",title:"Cookie Tab",body:c`
            <p>Manages the <strong>master switch</strong> for cross-domain cookie copy.</p>
            <ul>
              <li><strong>Toggle</strong> — When enabled, Ctrl+C/V/D shortcuts in the popup become active.</li>
              <li><strong>Shortcut reference</strong> — Lists the three shortcuts and their functions.</li>
              <li><strong>Disclaimer</strong> — Documents the copy scope (including HttpOnly cookies and all parent domains), risks, and intended use (development/testing only).</li>
            </ul>
            <p>When pasting, cookies with a non-<code>/</code> path get an additional copy with <code>path=/</code> for correct delivery across all paths.</p>
          `},{id:"config-batch",title:"Batch Operations",body:c`
            <p>Check table row boxes to enter batch mode. The toolbar shows the selected count and three buttons:</p>
            <ul>
              <li><strong>Import</strong> — Select a .json file to batch import. Duplicate IDs skipped.</li>
              <li><strong>Export</strong> — Download selected items as <code>data-records-YYYY-MM-DD.json</code> or <code>templates-YYYY-MM-DD.json</code>.</li>
              <li><strong>Batch delete</strong> — Confirm then delete all selected items. Cannot be undone.</li>
            </ul>
            <p>Each row also has an individual <strong>Export</strong> button for single-record export.</p>
          `}]}],tips:{id:"tips",title:"Tips & Notes",body:c`
      <ul>
        <li><strong>Keep CSS selectors simple.</strong> Prefer <code>#id</code> or <code>[name="xxx"]</code> over long hierarchical selectors.</li>
        <li><strong>URL matching is substring-based.</strong> A data URL of <code>example.com/login</code> matches all login page variants under that domain.</li>
        <li><strong>Cookie feature is off by default.</strong> Enable it manually in the Cookie tab after installation.</li>
        <li><strong>Changes take effect immediately.</strong> All create/edit/delete operations are instant — no need to reload.</li>
        <li><strong>Adjustable popup width.</strong> Switch between 400, 600, and 800px in the popup toolbar; card columns adapt.</li>
        <li><strong>Card order is persistent.</strong> Drag-and-drop order is saved and restored across sessions.</li>
        <li><strong>Drafts survive accidental close.</strong> Re-opening the modal restores unsaved content.</li>
        <li><strong>Selector fallback.</strong> If the CSS selector doesn't match, the extension tries field-name-based fallback.</li>
      </ul>
    `}}};let mt=class extends d{constructor(){super(...arguments),this._i18n=new t(this)}_scrollTo(t){const e=this.shadowRoot?.getElementById(t);e&&e.scrollIntoView({behavior:"smooth",block:"start"})}_pageDotClass(t){return 0===t?"popup":"config"}render(){const t=a(),e=ft[t]??ft.en;return c`
      <nav class="sidebar">
        <h4>${e.tocTitle}</h4>
        <ul class="toc-list">
          ${e.pages.map((t,e)=>c`
            <li>
              <span class="toc-page" @click=${()=>this._scrollTo(t.id)}>
                <span class="dot ${this._pageDotClass(e)}"></span>${t.title}
              </span>
              <ul class="toc-subs">
                ${t.sections.map(t=>c`
                  <li @click=${()=>this._scrollTo(t.id)}>${t.title}</li>
                `)}
              </ul>
            </li>
          `)}
          <li>
            <span class="toc-page" @click=${()=>this._scrollTo(e.tips.id)}>
              <span class="dot tips"></span>${e.tips.title}
            </span>
          </li>
        </ul>
      </nav>

      <div class="content">
        <h2>${e.title}</h2>
        <p class="intro">${e.intro}</p>

        ${e.pages.map((t,e)=>c`
          <div class="page-header" id=${t.id}>
            <span class="dot ${this._pageDotClass(e)}"></span>
            <h3>${t.title}</h3>
          </div>
          ${t.sections.map(t=>c`
            <div class="section" id=${t.id}>
              <h4>${t.title}</h4>
              ${t.body}
            </div>
          `)}
        `)}

        <div class="tips-section" id=${e.tips.id}>
          <h4>${e.tips.title}</h4>
          ${e.tips.body}
        </div>
      </div>
    `}};mt.styles=r`
    :host {
      display: flex; height: 100%; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 200px; flex-shrink: 0;
      padding: 24px 0 24px 0;
      border-right: 1px solid #e2e8f0;
      overflow-y: auto;
    }
    .sidebar h4 {
      font-size: 11px; font-weight: 600; color: #94a3b8; margin: 0 0 12px 0;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .toc-list { list-style: none; margin: 0; padding: 0; }
    .toc-page {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: #1e293b;
      padding: 5px 0; cursor: pointer;
    }
    .toc-page:hover { color: #2563eb; }
    .toc-page .dot {
      width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
    }
    .dot.popup { background: #4f46e5; }
    .dot.config { background: #2563eb; }
    .dot.tips { background: #ea580c; }

    .toc-subs { list-style: none; margin: 0 0 8px 12px; padding: 0; }
    .toc-subs li {
      font-size: 12px; color: #64748b; padding: 3px 0; cursor: pointer;
      line-height: 1.4;
    }
    .toc-subs li:hover { color: #2563eb; }

    /* ── Main content ── */
    .content {
      flex: 1; overflow-y: auto; padding: 24px 40px 40px;
    }
    .content h2 {
      font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 4px;
    }
    .content .intro {
      color: #94a3b8; font-size: 13px; margin: 0 0 28px; line-height: 1.6;
    }

    /* ── Page header ── */
    .page-header {
      display: flex; align-items: center; gap: 10px; margin: 32px 0 14px;
      scroll-margin-top: 40px;
    }
    .page-header:first-of-type { margin-top: 0; }
    .page-header .dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    }
    .page-header .dot.popup { background: #4f46e5; }
    .page-header .dot.config { background: #2563eb; }
    .page-header h3 {
      font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;
    }

    /* ── Section card ── */
    .section {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 18px 22px; margin-bottom: 12px;
      scroll-margin-top: 32px;
    }
    .section h4 {
      font-size: 14px; font-weight: 600; color: #1e293b; margin: 0 0 8px;
    }
    .section p {
      font-size: 13px; color: #475569; margin: 0 0 6px; line-height: 1.65;
    }
    .section p:last-child { margin-bottom: 0; }
    .section ul, .section ol {
      margin: 4px 0 6px; padding-left: 20px;
      font-size: 13px; color: #475569; line-height: 1.65;
    }
    .section li { margin-bottom: 3px; }
    .section li:last-child { margin-bottom: 0; }
    .section ul ul, .section ol ul { margin: 2px 0 2px; }
    .section code {
      display: inline-block; padding: 0 5px; border-radius: 4px;
      border: 1px solid #e2e8f0; background: #fff;
      font-size: 12px; font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      color: #1e293b;
    }

    kbd {
      display: inline-block; padding: 1px 7px; border-radius: 4px;
      border: 1px solid #cbd5e1; background: #fff;
      font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b; box-shadow: 0 1px 0 #cbd5e1; white-space: nowrap;
    }
    .shortcut-table {
      width: 100%; border-collapse: collapse; margin: 6px 0 8px;
      font-size: 13px; color: #475569;
    }
    .shortcut-table td {
      padding: 4px 0; vertical-align: top; line-height: 1.55;
    }
    .shortcut-table td:first-child {
      width: 70px; white-space: nowrap; padding-right: 12px;
    }
    .warning-box {
      background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px;
      padding: 10px 14px; margin-top: 8px;
      font-size: 13px; color: #92400e; line-height: 1.6;
    }
    .warning-box strong { color: #b45309; }

    /* ── Tips section ── */
    .tips-section {
      background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px;
      padding: 18px 22px; margin-top: 24px;
      scroll-margin-top: 32px;
    }
    .tips-section h4 {
      font-size: 14px; font-weight: 600; color: #c2410c; margin: 0 0 8px;
    }
    .tips-section ul {
      margin: 0; padding-left: 20px;
      font-size: 13px; color: #78350f; line-height: 1.65;
    }
    .tips-section li { margin-bottom: 3px; }
    .tips-section li:last-child { margin-bottom: 0; }
    .tips-section code {
      display: inline-block; padding: 0 4px; border-radius: 3px;
      border: 1px solid #fdba74; background: #fff;
      font-size: 12px; font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      color: #1e293b;
    }
  `,mt=((t,e,o,i)=>{for(var s,n=i>1?void 0:i?bt(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=s(n)||n);return n})([p("guide-page")],mt);var xt=Object.defineProperty,yt=Object.getOwnPropertyDescriptor,_t=(t,e,o,i)=>{for(var s,n=i>1?void 0:i?yt(e,o):e,a=t.length-1;a>=0;a--)(s=t[a])&&(n=(i?s(e,o,n):s(n))||n);return i&&n&&xt(e,o,n),n};let wt=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._tab="data"}_onTabChange(t){this._tab=t.detail}_toggleLang(){n.setLanguage("en"===a()?"zh":"en")}render(){return c`
      <div class="main">
        <div class="content-card">
          <tabs-nav .active=${this._tab} @tab-change=${this._onTabChange} @toggle-lang=${this._toggleLang}></tabs-nav>
          <div class="tab-body">
            ${"template"===this._tab?c`<template-management></template-management>`:"data"===this._tab?c`<data-management></data-management>`:"cookie"===this._tab?c`<cookie-settings></cookie-settings>`:c`<guide-page></guide-page>`}
          </div>
        </div>
      </div>
      <toast-notification></toast-notification>
    `}};wt.styles=r`
    :host {
      display: flex; flex-direction: column;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b; background: #f1f5f9;
    }

    .main {
      flex: 1; overflow: hidden;
      display: flex; flex-direction: column;
      padding: 24px 32px 32px;
    }
    .content-card {
      flex: 1;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
      overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .tab-body {
      flex: 1; overflow-y: auto;
      padding: 24px 32px 32px;
    }
  `,_t([g()],wt.prototype,"_tab",2),wt=_t([p("config-app")],wt);
