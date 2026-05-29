import{I as e,S as t,d as r,s as a,b as s,a as i}from"./toast-notification-BppDpdnp.js";import{i as o,n,a as d,b as c,t as l,r as p}from"./lit-D6WVJR7_.js";function h(e,t){return!!t&&e.toLowerCase().includes(t.toLowerCase())}var u=Object.defineProperty,g=Object.getOwnPropertyDescriptor,b=(e,t,r,a)=>{for(var s,i=a>1?void 0:a?g(t,r):t,o=e.length-1;o>=0;o--)(s=e[o])&&(i=(a?s(t,r,i):s(i))||i);return a&&i&&u(t,r,i),i};let f=class extends d{constructor(){super(...arguments),this._i18n=new e(this),this.matched=!1,this.draggable=!1,this.index=0}_onClick(){this.matched&&this.dispatchEvent(new CustomEvent("card-fill",{detail:this.record,bubbles:!0,composed:!0}))}_onUrlClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("card-navigate",{detail:this.record.url,bubbles:!0,composed:!0}))}_onDragStart(e){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(this.index))}render(){return c`
      <div class="card ${this.matched?"matched":"dimmed"}" @click=${this._onClick}>
        ${this.draggable?c`<span class="drag-handle" draggable="true" @dragstart=${this._onDragStart} title="Drag to reorder">&#x2630;</span>`:""}
        <span class="name" title=${this.record.name}>${this.record.name}</span>
        <span class="url-link" @click=${this._onUrlClick} title=${"前往："+this.record.url}>${this._i18n.t("template.url")}</span>
      </div>
    `}};f.styles=o`
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
  `,b([n({type:Object})],f.prototype,"record",2),b([n({type:Boolean})],f.prototype,"matched",2),b([n({type:Boolean})],f.prototype,"draggable",2),b([n({type:Number})],f.prototype,"index",2),f=b([l("data-card")],f);var m=Object.defineProperty,y=Object.getOwnPropertyDescriptor,_=(e,t,r,a)=>{for(var s,i=a>1?void 0:a?y(t,r):t,o=e.length-1;o>=0;o--)(s=e[o])&&(i=(a?s(t,r,i):s(i))||i);return a&&i&&m(t,r,i),i};let v=class extends d{constructor(){super(...arguments),this.records=[],this.order=[],this.columns=3}get _sorted(){return this.records}_onDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"}_onDrop(e,t){e.preventDefault();const r=Number(e.dataTransfer.getData("text/plain"));if(isNaN(r)||r===t)return;const a=this._sorted.map(e=>e.id),[s]=a.splice(r,1);a.splice(t,0,s),this.dispatchEvent(new CustomEvent("order-change",{detail:a,bubbles:!0,composed:!0}))}render(){const e=this._sorted;return c`
      <div class="grid" style="grid-template-columns:repeat(${this.columns},1fr)" @dragover=${this._onDragOver}>
        ${e.map((e,t)=>c`
          <div @drop=${e=>this._onDrop(e,t)}>
            <data-card
              .record=${{id:e.id,name:e.name,url:e.url}}
              .matched=${e.matched}
              .draggable=${!0}
              .index=${t}
            ></data-card>
          </div>
        `)}
      </div>
    `}};v.styles=o`
    :host { display: block; }
    .grid {
      display: grid; gap: 5px;
    }
  `,_([n({type:Array})],v.prototype,"records",2),_([n({type:Array})],v.prototype,"order",2),_([n({type:Number})],v.prototype,"columns",2),v=_([l("data-card-list")],v);var x=Object.defineProperty,w=Object.getOwnPropertyDescriptor,C=(e,t,r,a)=>{for(var s,i=a>1?void 0:a?w(t,r):t,o=e.length-1;o>=0;o--)(s=e[o])&&(i=(a?s(t,r,i):s(i))||i);return a&&i&&x(t,r,i),i};let k=class extends d{constructor(){super(...arguments),this.message="No data"}render(){return c`
      <div class="icon">&#x1F4CB;</div>
      <div class="text">${this.message}</div>
    `}};k.styles=o`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #94a3b8;
      text-align: center;
    }
    .icon {
      font-size: 32px;
      margin-bottom: 10px;
      opacity: 0.5;
    }
    .text {
      font-size: 13px;
      line-height: 1.5;
      max-width: 280px;
    }
  `,C([n({type:String})],k.prototype,"message",2),k=C([l("empty-state")],k);var $=Object.defineProperty,O=Object.getOwnPropertyDescriptor,D=(e,t,r,a)=>{for(var s,i=a>1?void 0:a?O(t,r):t,o=e.length-1;o>=0;o--)(s=e[o])&&(i=(a?s(t,r,i):s(i))||i);return a&&i&&$(t,r,i),i};const I=[400,600,800];let T=class extends d{constructor(){super(...arguments),this._i18n=new e(this),this._records=new t(this,r),this._settings=new t(this,a),this._currentUrl="",this._searchQuery="",this._activeTabId=0,this._onKeyDown=e=>{if(!e.ctrlKey&&!e.metaKey)return;const t=e.composedPath()[0],r=t?.tagName?.toLowerCase(),a=t?.isContentEditable;"input"===r||"textarea"===r||"select"===r||a||("c"===e.key||"С"===e.key?(e.preventDefault(),this._copyCookies()):"v"===e.key||"В"===e.key?(e.preventDefault(),this._pasteCookies()):"d"===e.key&&(e.preventDefault(),this._clearCookies()))}}connectedCallback(){super.connectedCallback(),this._records.load(),this._settings.load(),this._fetchCurrentTab(),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown)}async _fetchCurrentTab(){const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});this._currentUrl=e?.url??"",this._activeTabId=e?.id??0}async _getTabId(){if(this._activeTabId)return this._activeTabId;const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return this._activeTabId=e?.id??0,this._activeTabId}async _copyCookies(){if(!a.isCookieCopyEnabled)return;const e=await this._getTabId();if(e)try{const t=await chrome.runtime.sendMessage({action:"COPY_COOKIES",payload:{tabId:e}});s(t?.message??this._i18n.t("popup.copyFailed"),t?.success?"success":"error")}catch{s(this._i18n.t("popup.copyFailed"),"error")}else s(this._i18n.t("popup.noActiveTab"),"warning")}async _pasteCookies(){if(!a.isCookieCopyEnabled)return;const e=await this._getTabId();if(e)try{const t=await chrome.runtime.sendMessage({action:"PASTE_COOKIES",payload:{tabId:e}});let r="error";t?.success?r="success":t?.total>0&&t?.failed<t?.total&&(r="warning"),s(t?.message??this._i18n.t("popup.pasteFailed"),r)}catch{s(this._i18n.t("popup.pasteFailed"),"error")}else s(this._i18n.t("popup.noActiveTab"),"warning")}async _clearCookies(){if(!a.isCookieCopyEnabled)return;const e=await this._getTabId();if(e)try{const t=await chrome.runtime.sendMessage({action:"CLEAR_COOKIES",payload:{tabId:e}});let r="error";t?.success&&0===t?.failed?r="success":t?.removed>0&&t?.failed>0&&(r="warning");const a=t?.message??this._i18n.t("popup.clearFailed");s(a,r)}catch{s(this._i18n.t("popup.clearFailed"),"error")}else s(this._i18n.t("popup.noActiveTab"),"warning")}_onSearch(e){this._searchQuery=e.detail.value}_onWidthChange(e){const t=Number(e.target.value);t&&a.setPopupWidth(t)}get _columns(){return Math.round(this._settings.state.popupWidth/200)}async _onCardFill(e){const t=e.detail,[a]=await chrome.tabs.query({active:!0,currentWindow:!0});if(!a?.id)return;const i=r.getById(t.id);if(i)try{const e=await chrome.runtime.sendMessage({action:"AUTO_FILL_FORM",payload:{tabId:a.id,record:i}}),t=e?.total??e?.filled??0,r=e?.filled??0,o=t-r,n=e?.failed>0||e?.selectorMissed?.length>0,d=!1===e?.success?"error":n?"warning":"success";s(e?.message??(o>0?this._i18n.t("popup.fillPartial",{filled:r,total:t,missed:o}):this._i18n.t("popup.fillSuccess",{filled:r,total:t})),d)}catch{s(this._i18n.t("popup.fillFailed"),"error")}}_onCardNavigate(e){chrome.tabs.create({url:e.detail})}async _onOrderChange(e){await a.setDataCardOrder(e.detail)}_openConfig(){chrome.runtime.openOptionsPage()}_toggleLang(){a.setLanguage("en"===i()?"zh":"en")}_getCards(){let e=this._records.state;if(this._searchQuery){const t=this._searchQuery.toLowerCase();e=e.filter(e=>e.name.toLowerCase().includes(t)||e.url.toLowerCase().includes(t))}const t=[],r=[];for(const i of e)h(this._currentUrl,i.url)?t.push(i):r.push(i);const a=new Map(this._settings.state.dataCardOrder.map((e,t)=>[e,t])),s=(e,t)=>(a.get(e.id)??e.order)-(a.get(t.id)??t.order);return t.sort(s),r.sort(s),[...t,...r]}render(){const e=this._getCards(),t=this._settings.state.popupWidth;return c`
      <div class="root" style="--popup-width:${t}px">
      <div class="topbar">
        <search-bar placeholder=${this._i18n.t("popup.search")} @search-change=${this._onSearch}></search-bar>
        <select class="width-select" @change=${this._onWidthChange}>
          ${I.map(e=>c`<option value=${e} ?selected=${t===e}>${e}px</option>`)}
        </select>
        <button class="hdr-btn" @click=${this._toggleLang}>${this._i18n.t("lang.switch")}</button>
        <button class="hdr-btn" @click=${this._openConfig}>${this._i18n.t("popup.configure")}</button>
      </div>

      <div class="cards-area">
        ${e.length>0?c`
              <data-card-list
                .records=${e.map(e=>({id:e.id,name:e.name,url:e.url,matched:h(this._currentUrl,e.url)}))}
                .order=${this._settings.state.dataCardOrder}
                .columns=${this._columns}
                @card-fill=${this._onCardFill}
                @card-navigate=${this._onCardNavigate}
                @order-change=${this._onOrderChange}
              ></data-card-list>
            `:c`<empty-state message=${this._i18n.t("popup.noData")}></empty-state>`}
      </div>
      </div>

      <toast-notification></toast-notification>
    `}};T.styles=o`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b; background: #fff;
    }
    .root {
      width: var(--popup-width, 600px);
    }

    .topbar {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    search-bar { flex: 1; min-width: 0; }
    .hdr-btn {
      font-size: 12px; color: #475569; cursor: pointer;
      padding: 5px 12px; border-radius: 5px;
      border: 1px solid #e2e8f0; background: #fff;
      transition: all 0.12s; white-space: nowrap; line-height: 1.4;
    }
    .hdr-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }
    .width-select {
      font-size: 11px; padding: 5px 4px; border-radius: 5px;
      border: 1px solid #e2e8f0; background: #fff; color: #475569;
      outline: none; cursor: pointer; font-family: inherit;
    }

    .cards-area {
      padding: 8px 12px 14px;
      max-height: 480px; overflow-y: auto;
    }
    .cards-area::-webkit-scrollbar { width: 4px; }
    .cards-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `,D([p()],T.prototype,"_currentUrl",2),D([p()],T.prototype,"_searchQuery",2),T=D([l("popup-app")],T);
