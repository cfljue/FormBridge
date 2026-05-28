const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/toast-notification-C9BxLYJW.js","assets/lit-D6WVJR7_.js"])))=>i.map(i=>d[i]);
import{I as t,B as e,g as o,S as i,d as s,s as a,a as n}from"./toast-notification-C9BxLYJW.js";import{i as r,n as l,a as d,b as c,t as p,e as h,r as b}from"./lit-D6WVJR7_.js";var m=Object.defineProperty,u=Object.getOwnPropertyDescriptor,f=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?u(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&m(e,o,a),a};let g=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.active="data"}_select(t){this.active=t,this.dispatchEvent(new CustomEvent("tab-change",{detail:t,bubbles:!0,composed:!0}))}render(){return c`
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
      <button class="lang-btn" @click=${()=>this.dispatchEvent(new CustomEvent("toggle-lang",{bubbles:!0,composed:!0}))}>${this._i18n.t("lang.switch")}</button>
    `}};g.styles=r`
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
    .lang-btn {
      padding: 5px 14px; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      transition: all 0.15s; white-space: nowrap;
    }
    .lang-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
  `,f([l({type:String})],g.prototype,"active",2),g=f([p("tabs-nav")],g);const _={},x=function(t,e,o){let i=Promise.resolve();if(e&&e.length>0){let t=function(t){return Promise.all(t.map(t=>Promise.resolve(t).then(t=>({status:"fulfilled",value:t}),t=>({status:"rejected",reason:t}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),s=o?.nonce||o?.getAttribute("nonce");i=t(e.map(t=>{if((t=function(t){return"/"+t}(t))in _)return;_[t]=!0;const e=t.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${o}`))return;const i=document.createElement("link");return i.rel=e?"stylesheet":"modulepreload",e||(i.as="script"),i.crossOrigin="",i.href=t,s&&i.setAttribute("nonce",s),document.head.appendChild(i),e?new Promise((e,o)=>{i.addEventListener("load",e),i.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${t}`)))}):void 0}))}function s(t){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=t,window.dispatchEvent(e),!e.defaultPrevented)throw t}return i.then(e=>{for(const t of e||[])"rejected"===t.status&&s(t.reason);return t().catch(s)})},y="templates";const w=new class extends e{constructor(){super([])}async load(){const t=await chrome.storage.local.get(y);this.replaceState(t[y]??[])}async persist(){await chrome.storage.local.set({[y]:this._state})}_newTemplate(t,e,i,s,a){const n=Date.now();return{id:o(),name:t,description:e,url:i,fields:s.map(t=>({...t,id:t.id||o()})),button:a&&a.selector?{...a}:void 0,createdAt:n,updatedAt:n}}async add(t){const e=this._newTemplate(t.name,t.description,t.url,t.fields,t.button);return this.replaceState([e,...this._state]),await this.persist(),e}async update(t,e){this.replaceState(this._state.map(i=>i.id===t?{...i,...e,fields:e.fields?e.fields.map(t=>({...t,id:t.id||o()})):i.fields,button:void 0!==e.button?e.button&&e.button.selector?{...e.button}:void 0:i.button,updatedAt:Date.now()}:i)),await this.persist()}async delete(t){this.replaceState(this._state.filter(e=>e.id!==t)),await this.persist()}async deleteMany(t){const e=new Set(t);this.replaceState(this._state.filter(t=>!e.has(t.id))),await this.persist()}getById(t){return this._state.find(e=>e.id===t)}async importFrom(t){const e=new Set(this._state.map(t=>t.id)),o=t.filter(t=>!e.has(t.id));return o.length>0&&(this.replaceState([...o,...this._state]),await this.persist()),o.length}};function v(t,e,o){if(!e.trim())return t;const i=e.toLowerCase();return t.filter(t=>o.some(e=>{const o=t[e];return"string"==typeof o&&o.toLowerCase().includes(i)}))}var k=Object.defineProperty,$=Object.getOwnPropertyDescriptor,D=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?$(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&k(e,o,a),a};let S=class extends d{constructor(){super(...arguments),this.columns=[],this.rows=[],this.selectedIds=[],this.idKey="id",this.rowActions=[],this.showCheckbox=!0,this.actionsHeader="Actions",this.emptyText="No data",this.sortKey="",this.sortDir="asc"}_toggleSelectAll(t){const e=t.target.checked;this.selectedIds=e?this.rows.map(t=>t[this.idKey]):[],this._emitSelection()}_toggleOne(t){const e=this.selectedIds.indexOf(t);this.selectedIds=e>=0?[...this.selectedIds.slice(0,e),...this.selectedIds.slice(e+1)]:[...this.selectedIds,t],this._emitSelection()}_emitSelection(){this.dispatchEvent(new CustomEvent("selection-change",{detail:[...this.selectedIds],bubbles:!0,composed:!0}))}_sort(t){this.sortKey===t?"asc"===this.sortDir?this.sortDir="desc":"desc"===this.sortDir&&(this.sortKey="",this.sortDir="asc"):(this.sortKey=t,this.sortDir="asc")}_emitAction(t,e){this.dispatchEvent(new CustomEvent("row-action",{detail:{action:t,row:e},bubbles:!0,composed:!0}))}get _sortedRows(){return this.sortKey?[...this.rows].sort((t,e)=>{const o=String(t[this.sortKey]??""),i=String(e[this.sortKey]??""),s=o.localeCompare(i);return"asc"===this.sortDir?s:-s}):this.rows}render(){const t=this.rows.length>0&&this.rows.every(t=>this.selectedIds.includes(t[this.idKey])),e=this.columns.length+(this.showCheckbox?1:0)+(this.rowActions.length>0?1:0);return c`
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
              ${this.showCheckbox?c`<td class="check-col"><input type="checkbox" .checked=${this.selectedIds.includes(t[this.idKey])} @change=${()=>this._toggleOne(t[this.idKey])} /></td>`:""}
              ${this.columns.map(e=>c`<td title=${String(t[e.key]??"")}>${t[e.key]}</td>`)}
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
    `}};S.styles=r`
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
  `,D([l({type:Array})],S.prototype,"columns",2),D([l({type:Array})],S.prototype,"rows",2),D([l({type:Array})],S.prototype,"selectedIds",2),D([l({type:String})],S.prototype,"idKey",2),D([l({type:Array})],S.prototype,"rowActions",2),D([l({type:Boolean})],S.prototype,"showCheckbox",2),D([l({type:String})],S.prototype,"actionsHeader",2),D([l({type:String})],S.prototype,"emptyText",2),D([l({type:String})],S.prototype,"sortKey",2),D([l({type:String})],S.prototype,"sortDir",2),S=D([p("data-table")],S);var I=Object.defineProperty,T=Object.getOwnPropertyDescriptor,C=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?T(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&I(e,o,a),a};let E=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.selectedCount=0,this.showImport=!0,this.showExport=!0,this.showDelete=!0}_triggerImport(){const t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=t=>{const e=t.target.files?.[0];if(!e)return;const o=new FileReader;o.onload=()=>{this.dispatchEvent(new CustomEvent("batch-import",{detail:{content:o.result},bubbles:!0,composed:!0}))},o.readAsText(e)},t.click()}_triggerExport(){this.dispatchEvent(new CustomEvent("batch-export",{bubbles:!0,composed:!0}))}_triggerDelete(){this.dispatchEvent(new CustomEvent("batch-delete",{bubbles:!0,composed:!0}))}render(){return c`
      ${this.showImport?c`<button @click=${this._triggerImport}>${this._i18n.t("config.import")}</button>`:""}
      ${this.showExport?c`<button @click=${this._triggerExport} ?disabled=${0===this.selectedCount}>${this._i18n.t("config.export")}</button>`:""}
      ${this.showDelete?c`<button class="btn-delete" @click=${this._triggerDelete} ?disabled=${0===this.selectedCount}>${this._i18n.t("config.delete")}</button>`:""}
      ${this.selectedCount>0?c`<span class="count">${this._i18n.t("config.selected",{count:this.selectedCount})}</span>`:""}
    `}};E.styles=r`
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
  `,C([l({type:Number})],E.prototype,"selectedCount",2),C([l({type:Boolean})],E.prototype,"showImport",2),C([l({type:Boolean})],E.prototype,"showExport",2),C([l({type:Boolean})],E.prototype,"showDelete",2),E=C([p("batch-toolbar")],E);var z=Object.defineProperty,O=Object.getOwnPropertyDescriptor,j=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?O(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&z(e,o,a),a};let A=class extends d{constructor(){super(...arguments),this.open=!1,this.title="Confirm",this.message="Are you sure?",this.confirmLabel="Delete",this.cancelLabel="Cancel"}confirm(){this.open=!1,this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}cancel(){this.open=!1,this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?c`
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
    `:c``}};A.styles=r`
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
  `,j([l({type:Boolean,reflect:!0})],A.prototype,"open",2),j([l({type:String})],A.prototype,"title",2),j([l({type:String})],A.prototype,"message",2),j([l({type:String})],A.prototype,"confirmLabel",2),j([l({type:String})],A.prototype,"cancelLabel",2),A=j([p("confirm-dialog")],A);var B=Object.defineProperty,P=Object.getOwnPropertyDescriptor,R=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?P(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&B(e,o,a),a};let N=class extends d{constructor(){super(...arguments),this.fields=[],this.mode="definition",this.readonly=!1,this.showDrag=!1}_notify(){this.dispatchEvent(new CustomEvent("fields-change",{detail:[...this.fields],bubbles:!0,composed:!0}))}_updateField(t,e,o){this.fields=this.fields.map(i=>i.id===t?{...i,[e]:o}:i),this._notify()}addRow(){this.fields=[...this.fields,{id:o(),name:"",selector:"",value:""}],this._notify()}copyRow(t){const e=this.fields.findIndex(e=>e.id===t);if(-1===e)return;const i=this.fields[e],s={...i,id:o(),name:i.name+" (copy)"},a=[...this.fields];a.splice(e+1,0,s),this.fields=a,this._notify()}deleteRow(t){this.fields=this.fields.filter(e=>e.id!==t),this._notify()}_onDragStart(t,e){t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",String(e))}_onDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="move"}_onDrop(t,e){t.preventDefault();const o=Number(t.dataTransfer.getData("text/plain"));if(isNaN(o)||o===e)return;const i=[...this.fields],[s]=i.splice(o,1);i.splice(e,0,s),this.fields=i,this._notify()}render(){const t="definition"===this.mode,e="value"===this.mode;return c`
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
    `}};N.styles=r`
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
  `,R([l({type:Array})],N.prototype,"fields",2),R([l({type:String})],N.prototype,"mode",2),R([l({type:Boolean})],N.prototype,"readonly",2),R([l({type:Boolean})],N.prototype,"showDrag",2),N=R([p("dynamic-field-list")],N);var F=Object.defineProperty,L=Object.getOwnPropertyDescriptor,U=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?L(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&F(e,o,a),a};let q=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="definition",this.name="",this.description="",this.url="",this.fields=[],this.buttonName="",this.buttonSelector=""}_notify(){this.dispatchEvent(new CustomEvent("form-change",{detail:{name:this.name,description:this.description,url:this.url,fields:[...this.fields],buttonName:this.buttonName,buttonSelector:this.buttonSelector},bubbles:!0,composed:!0}))}_onInput(t,e){this[t]=e.target.value,this._notify()}_onFieldsChange(t){this.fields=t.detail,this._notify()}render(){const t="definition"===this.mode;return c`
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
    `}};q.styles=r`
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
  `,U([l({type:String})],q.prototype,"mode",2),U([l({type:String})],q.prototype,"name",2),U([l({type:String})],q.prototype,"description",2),U([l({type:String})],q.prototype,"url",2),U([l({type:Array})],q.prototype,"fields",2),U([l({type:String})],q.prototype,"buttonName",2),U([l({type:String})],q.prototype,"buttonSelector",2),q=U([p("form-config")],q);var K=Object.defineProperty,M=Object.getOwnPropertyDescriptor,V=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?M(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&K(e,o,a),a};let Q=class extends d{constructor(){super(...arguments),this.open=!1,this.title="",this.size="medium",this._onKeyDown=t=>{"Escape"===t.key&&this.close()}}close(){this.open=!1,this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown)}render(){return this.open?c`
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
    `:c``}};Q.styles=r`
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
  `,V([l({type:Boolean,reflect:!0})],Q.prototype,"open",2),V([l({type:String})],Q.prototype,"title",2),V([l({type:String})],Q.prototype,"size",2),Q=V([p("modal-dialog")],Q);var H=Object.defineProperty,J=Object.getOwnPropertyDescriptor,Y=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?J(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&H(e,o,a),a};let W=null,X=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="add",this.data={},this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""}}open(t){t?(this.data={...t},this._formData={name:t.name,description:t.description,url:t.url,fields:t.fields.map(t=>({id:t.id,name:t.name,selector:t.selector,value:""})),buttonName:t.button?.name??"",buttonSelector:t.button?.selector??""}):this._formData=W?{...W,fields:[...W.fields]}:{name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""},this.requestUpdate();const e=this.renderRoot.querySelector("#modal");e&&(e.open=!0)}close(){"add"===this.mode&&this._saveDraft();const t=this.renderRoot.querySelector("#modal");t&&(t.open=!1),this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}_onFormChange(t){this._formData=t.detail,this.requestUpdate()}_submit(){const t=this._formData;if(!t.name.trim())return;const e=t.fields.filter(t=>t.name.trim()).map(t=>({id:t.id,name:t.name.trim(),selector:t.selector?.trim()??""})),o=t.buttonSelector.trim()?{name:t.buttonName.trim()||"Submit",selector:t.buttonSelector.trim()}:void 0;this.dispatchEvent(new CustomEvent("template-submit",{detail:{name:t.name.trim(),description:t.description.trim(),url:t.url.trim(),fields:e,button:o},bubbles:!0,composed:!0})),this._clearDraft(),this.close()}_saveDraft(){W={...this._formData,fields:[...this._formData.fields]}}_clearDraft(){W=null}render(){const t="edit"===this.mode?this._i18n.t("template.edit"):"copy"===this.mode?this._i18n.t("template.copy"):"extract"===this.mode?this._i18n.t("template.extract"):this._i18n.t("template.new");return c`
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
    `}};X.styles=r`
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
  `,Y([l({type:String})],X.prototype,"mode",2),Y([l({type:Object})],X.prototype,"data",2),X=Y([p("template-modal")],X);var G=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,tt=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?Z(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&G(e,o,a),a};let et=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._templates=new i(this,w,!0),this._searchQuery="",this._selectedIds=[],this._deleteTarget=[]}get _columns(){return[{key:"name",label:this._i18n.t("template.name"),sortable:!0,width:"160px"},{key:"url",label:this._i18n.t("template.url"),sortable:!1,width:"240px"},{key:"description",label:this._i18n.t("template.description"),sortable:!1}]}get _actions(){return[{key:"edit",label:this._i18n.t("config.edit")},{key:"copy",label:this._i18n.t("config.copy")},{key:"delete",label:this._i18n.t("config.delete")},{key:"export",label:this._i18n.t("config.export")}]}get _filtered(){return v(this._templates.state,this._searchQuery,["name","description","url"])}_onSearch(t){this._searchQuery=t.detail.value,this.requestUpdate()}_onSelection(t){this._selectedIds=t.detail,this.requestUpdate()}_onRowAction(t){const{action:e,row:o}=t.detail,i=o;switch(e){case"edit":this._editData=i,this._modal.mode="edit",this._modal.open(i);break;case"copy":this._editData=void 0,this._modal.mode="copy",this._modal.open({...i,name:i.name+" (Copy)"});break;case"delete":this._deleteTarget=[i.id],this._confirm.title=this._i18n.t("template.deleteTitle"),this._confirm.message=this._i18n.t("template.deleteMsg",{name:i.name}),this._confirm.open=!0;break;case"export":this._exportSelection([i.id])}}async _onConfirm(){if(this._deleteTarget.length){const t=this._deleteTarget.length;await w.deleteMany(this._deleteTarget),this._deleteTarget=[],this._selectedIds=[];const{showToast:e}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));e(this._i18n.t("template.deleted",{count:t}),"success")}this.requestUpdate()}async _onTemplateSubmit(t){const e=t.detail;this._editData?await w.update(this._editData.id,e):await w.add(e),this._editData=void 0}_onBatchExport(){this._exportSelection(this._selectedIds)}_exportSelection(t){const e=this._templates.state.filter(e=>t.includes(e.id));if(!e.length)return;const o=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(o),s=document.createElement("a");s.href=i,s.download=`templates-${(new Date).toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(i)}async _onBatchImport(t){try{const e=JSON.parse(t.detail.content);if(!Array.isArray(e))throw new Error("Invalid format");const o=await w.importFrom(e),{showToast:i}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));i(this._i18n.t("template.imported",{count:o}),"success")}catch{const{showToast:t}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));t(this._i18n.t("template.importFailed"),"error")}}_onBatchDelete(){this._deleteTarget=[...this._selectedIds],this._confirm.title=this._i18n.t("template.deleteBatchTitle"),this._confirm.message=this._i18n.t("template.deleteBatchMsg",{count:this._deleteTarget.length}),this._confirm.open=!0}_openAdd(){this._editData=void 0,this._modal.mode="add",this._modal.open()}connectedCallback(){super.connectedCallback(),this._templates.load()}render(){const t=this._filtered;return c`
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
    `}};et.styles=r`
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
  `,tt([h("template-modal")],et.prototype,"_modal",2),tt([h("confirm-dialog")],et.prototype,"_confirm",2),et=tt([p("template-management")],et);var ot=Object.defineProperty,it=Object.getOwnPropertyDescriptor,st=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?it(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&ot(e,o,a),a};let at=null,nt=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this.mode="add",this._templates=new i(this,w,!0),this._selectedTemplateId="",this._restoring=!1,this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""}}open(t){if(this._selectedTemplateId="",t){this._selectedTemplateId=t.templateId;const e=w.getById(t.templateId);this._formData={name:t.name,description:t.description||e?.description||"",url:t.url,fields:this._buildValueFields(t.templateId,t.values),buttonName:t.buttonName??"",buttonSelector:t.buttonSelector??""}}else at?(this._restoring=!0,this._selectedTemplateId=at.templateId,this._formData={name:at.name,description:at.description,url:at.url,fields:[...at.fields],buttonName:at.buttonName,buttonSelector:at.buttonSelector}):this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""};this.requestUpdate();const e=this.renderRoot.querySelector("#modal");e&&(e.open=!0)}updated(t){super.updated(t),this._restoring=!1}_buildValueFields(t,e){const o=Array.isArray(e)?e:Object.entries(e).map(([t,e])=>({name:t,selector:"",value:e})),i=w.getById(t);return i?i.fields.map(t=>{const e=o.find(e=>e.name===t.name)??o.find(e=>e.selector===t.selector);return{id:t.id,name:t.name,selector:t.selector,value:e?.value??""}}):o.map(t=>({id:crypto.randomUUID(),...t}))}close(){"add"===this.mode&&this._saveDraft();const t=this.renderRoot.querySelector("#modal");t&&(t.open=!1),this.dispatchEvent(new CustomEvent("modal-close",{bubbles:!0,composed:!0}))}_onTemplateChange(t){if(this._restoring)return;const e=t.target.value;if(this._selectedTemplateId=e,!e)return this._formData={name:"",description:"",url:"",fields:[],buttonName:"",buttonSelector:""},void this.requestUpdate();const o=w.getById(e);o&&(this._formData={name:this._formData.name||o.name,description:o.description,url:this._formData.url||o.url,fields:o.fields.map(t=>({id:t.id,name:t.name,selector:t.selector,value:""})),buttonName:this._formData.buttonName||o.button?.name||"",buttonSelector:this._formData.buttonSelector||o.button?.selector||""},this.requestUpdate())}_onFormChange(t){this._formData=t.detail,this.requestUpdate()}_saveDraft(){at={...this._formData,fields:[...this._formData.fields],templateId:this._selectedTemplateId}}_submit(){const t=this._formData;if(!t.name.trim())return;const e=t.fields.filter(t=>t.value?.trim()).map(t=>({name:t.name,selector:t.selector??"",value:t.value.trim()}));this.dispatchEvent(new CustomEvent("data-submit",{detail:{name:t.name.trim(),description:t.description.trim(),url:t.url.trim(),templateId:this._selectedTemplateId,values:e,buttonName:t.buttonName.trim()||void 0,buttonSelector:t.buttonSelector.trim()||void 0},bubbles:!0,composed:!0})),this._clearDraft(),this.close()}_clearDraft(){at=null}render(){const t=this._templates.state,e="edit"===this.mode?this._i18n.t("data.edit"):"copy"===this.mode?this._i18n.t("data.copy"):this._i18n.t("data.new");return c`
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
    `}};nt.styles=r`
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
  `,st([l({type:String})],nt.prototype,"mode",2),nt=st([p("data-wizard")],nt);var rt=Object.defineProperty,lt=Object.getOwnPropertyDescriptor,dt=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?lt(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&rt(e,o,a),a};let ct=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._records=new i(this,s,!0),this._searchQuery="",this._selectedIds=[],this._deleteTarget=[]}get _columns(){return[{key:"name",label:this._i18n.t("template.name"),sortable:!0,width:"160px"},{key:"url",label:this._i18n.t("template.url"),sortable:!1,width:"240px"},{key:"description",label:this._i18n.t("template.description"),sortable:!1}]}get _actions(){return[{key:"edit",label:this._i18n.t("config.edit")},{key:"copy",label:this._i18n.t("config.copy")},{key:"delete",label:this._i18n.t("config.delete")},{key:"extract",label:this._i18n.t("data.extractTemplate")},{key:"export",label:this._i18n.t("config.export")}]}get _filtered(){return v(this._records.state,this._searchQuery,["name","url"])}_onSearch(t){this._searchQuery=t.detail.value,this.requestUpdate()}_onSelection(t){this._selectedIds=t.detail,this.requestUpdate()}_onRowAction(t){const{action:e,row:o}=t.detail,i=o;switch(e){case"edit":this._editData=i,this._wizard.mode="edit",this._wizard.open(i);break;case"copy":this._wizard.mode="copy",this._wizard.open({...i,name:i.name+" (Copy)"});break;case"delete":this._deleteTarget=[i.id],this._confirm.title=this._i18n.t("data.deleteTitle"),this._confirm.message=this._i18n.t("data.deleteMsg",{name:i.name}),this._confirm.open=!0;break;case"extract":{const t=w.getById(i.templateId),e=i.values.length>0?i.values.map(t=>({id:t.name,name:t.name,selector:t.selector})):(t?.fields??[]).map(t=>({id:t.id,name:t.name,selector:t.selector})),o={id:"",name:i.name,description:i.description||t?.description||"",url:i.url,fields:e,button:i.buttonSelector?{name:i.buttonName||"",selector:i.buttonSelector}:void 0,createdAt:Date.now(),updatedAt:Date.now()};this._tmodal.mode="extract",this._tmodal.open(o);break}case"export":this._exportSelection([i.id])}}async _onConfirm(){if(this._deleteTarget.length){const t=this._deleteTarget.length;await s.deleteMany(this._deleteTarget),this._deleteTarget=[],this._selectedIds=[];const{showToast:e}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));e(this._i18n.t("data.deleted",{count:t}),"success"),this.requestUpdate()}}async _onDataSubmit(t){const e=t.detail;this._editData?await s.update(this._editData.id,e):await s.add(e),this._editData=void 0}async _onExtractSubmit(t){const e=t.detail;await w.add(e);const{showToast:o}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));o(this._i18n.t("data.templateExtracted"),"success")}_onBatchExport(){this._exportSelection(this._selectedIds)}_exportSelection(t){const e=this._records.state.filter(e=>t.includes(e.id));if(!e.length)return;const o=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(o),s=document.createElement("a");s.href=i,s.download=`data-records-${(new Date).toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(i)}async _onBatchImport(t){try{const e=JSON.parse(t.detail.content);if(!Array.isArray(e))throw new Error("Invalid format");const o=await s.importFrom(e),{showToast:i}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));i(this._i18n.t("data.imported",{count:o}),"success")}catch{const{showToast:t}=await x(async()=>{const{showToast:t}=await import("./toast-notification-C9BxLYJW.js").then(t=>t.t);return{showToast:t}},__vite__mapDeps([0,1]));t(this._i18n.t("data.importFailed"),"error")}}_onBatchDelete(){this._deleteTarget=[...this._selectedIds],this._confirm.title=this._i18n.t("data.deleteBatchTitle"),this._confirm.message=this._i18n.t("data.deleteBatchMsg",{count:this._deleteTarget.length}),this._confirm.open=!0}_openAdd(){this._editData=void 0,this._wizard.mode="add",this._wizard.open()}connectedCallback(){super.connectedCallback(),this._records.load()}render(){const t=this._filtered;return c`
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
    `}};ct.styles=r`
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
  `,dt([h("data-wizard")],ct.prototype,"_wizard",2),dt([h("confirm-dialog")],ct.prototype,"_confirm",2),dt([h("template-modal")],ct.prototype,"_tmodal",2),ct=dt([p("data-management")],ct);var pt=Object.getOwnPropertyDescriptor;let ht=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._settings=new i(this,a)}connectedCallback(){super.connectedCallback(),this._settings.load()}_toggle(t){const e=t.target.checked;a.setCookieCopyEnabled(e)}render(){const t=this._settings.state.cookieCopyEnabled;return c`
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
    `}};ht.styles=r`
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
  `,ht=((t,e,o,i)=>{for(var s,a=i>1?void 0:i?pt(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=s(a)||a);return a})([p("cookie-settings")],ht);var bt=Object.defineProperty,mt=Object.getOwnPropertyDescriptor,ut=(t,e,o,i)=>{for(var s,a=i>1?void 0:i?mt(e,o):e,n=t.length-1;n>=0;n--)(s=t[n])&&(a=(i?s(e,o,a):s(a))||a);return i&&a&&bt(e,o,a),a};let ft=class extends d{constructor(){super(...arguments),this._i18n=new t(this),this._tab="data"}_onTabChange(t){this._tab=t.detail}_toggleLang(){a.setLanguage("en"===n()?"zh":"en")}render(){return c`
      <div class="main">
        <div class="content-card">
          <tabs-nav .active=${this._tab} @tab-change=${this._onTabChange} @toggle-lang=${this._toggleLang}></tabs-nav>
          <div class="tab-body">
            ${"template"===this._tab?c`<template-management></template-management>`:"data"===this._tab?c`<data-management></data-management>`:c`<cookie-settings></cookie-settings>`}
          </div>
        </div>
      </div>
      <toast-notification></toast-notification>
    `}};ft.styles=r`
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
  `,ut([b()],ft.prototype,"_tab",2),ft=ut([p("config-app")],ft);
