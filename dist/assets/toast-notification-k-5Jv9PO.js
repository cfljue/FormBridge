import{i as e,n as t,a,b as o,t as s,r as i}from"./lit-D6WVJR7_.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const n={en:{"popup.title":"Form Manege","popup.configure":"Configure","popup.search":"Search config...","popup.cookieCopy":"Cookie Copy","popup.noSnapshot":"No snapshot","popup.ready":"Ready","popup.noActiveTab":"Cannot get active tab","popup.noData":"No data yet. Open config to add templates and data.","popup.copySuccess":"Cookies copied!","popup.copyFailed":"Failed to copy cookies","popup.pasteSuccess":"Cookies pasted!","popup.pasteFailed":"Failed to paste cookies","popup.fillSuccess":"Filled {filled}/{total} fields. Button clicked!","popup.fillPartial":"Filled {filled}/{total} fields. Missed: {missed}","popup.fillFailed":"Auto-fill failed","popup.clearSuccess":"Cookies cleared! Page reloaded.","popup.clearPartial":"Partial clear: some cookies failed to remove. Page reloaded.","popup.clearFailed":"Failed to clear cookies","popup.matchBadge":"Match","config.title":"Form Manege","config.subtitle":"Manage form templates and data for auto-fill","config.tabTemplates":"Templates","config.tabData":"Data","config.save":"Save","config.cancel":"Cancel","config.confirm":"Confirm","config.delete":"Delete","config.edit":"Edit","config.copy":"Copy","config.export":"Export","config.import":"Import","config.searchTemplates":"Search templates...","config.searchData":"Search data...","config.selected":"{count} selected","config.noTemplates":"No templates","config.noData":"No data","config.noTableData":"No data","config.actions":"Actions","template.new":"New Template","template.edit":"Edit Template","template.copy":"Copy Template","template.name":"Name","template.nameRequired":"Name *","template.description":"Description","template.url":"URL","template.formFields":"Form Fields","template.extract":"Extract Template","template.addField":"+ Add field","template.fieldName":"Field name","template.fieldSelector":"CSS selector","template.buttonConfig":"Auto-click Button (optional)","template.buttonName":"Button Name","template.buttonSelector":"CSS Selector","template.deleteTitle":"Delete Template","template.deleteMsg":'Delete "{name}"? This cannot be undone.',"template.deleteBatchTitle":"Delete Templates","template.deleteBatchMsg":"Delete {count} template(s)? This cannot be undone.","template.imported":"Imported {count} template(s)","template.importFailed":"Import failed: Invalid JSON format","template.deleted":"Deleted {count} template(s)","data.new":"New Data","data.edit":"Edit Data","data.copy":"Copy Data","data.step1":"Select template","data.step2":"Fill values","data.selectTemplate":"Select a template (or fill manually)","data.manual":"Manual entry (no template)","data.recordName":"Data name","data.recordNameRequired":"Name *","data.fields":"Fields","data.noFields":"No fields defined. Select a template with fields.","data.next":"Next","data.back":"Back","data.deleteTitle":"Delete Data","data.deleteMsg":'Delete "{name}"? This cannot be undone.',"data.deleteBatchTitle":"Delete Data","data.deleteBatchMsg":"Delete {count} item(s)? This cannot be undone.","data.imported":"Imported {count} item(s)","data.importFailed":"Import failed: Invalid JSON format","data.deleted":"Deleted {count} item(s)","data.extractTemplate":"Extract Template","data.templateExtracted":"Template extracted! Go to Templates tab to view.","data.templateColumn":"Template","cookie.title":"Cookie & Storage Copy","cookie.enable":"Enable cross-domain cookie and storage copy","cookie.enableDesc":"When enabled, you can copy cookies/storage from one page and paste them to another. Once turned on, it stays on until manually turned off.","cookie.disclaimerTitle":"! Important Disclaimer","cookie.disclaimer1":"This feature copies ALL cookies (including HttpOnly) and localStorage/sessionStorage from the source domain to the target domain.","cookie.disclaimer2":"Use with caution. Copying cookies between different origins may cause unexpected behavior or session conflicts.","cookie.disclaimer3":"This tool is intended for development/testing purposes only. Do not use on production systems without proper authorization.","cookie.disclaimer4":"The feature is OFF by default. You must explicitly enable it on this page before it takes effect.","cookie.howtoTitle":"How to Use","cookie.howtoCopy":"In the popup, press Ctrl+C to capture all cookies and storage from the current page.","cookie.howtoPaste":"In the popup, press Ctrl+V to clear existing cookies first, then write captured cookies and storage to the current page and refresh.","cookie.howtoClear":"In the popup, press Ctrl+D to clear all cookies of the current page, then refresh.","config.tabCookie":"Cookie","config.tabGuide":"User Guide","lang.switch":"中文","lang.label":"Language","lang.en":"English","lang.zh":"中文"},zh:{"popup.title":"表单管理","popup.configure":"配置","popup.search":"搜索配置...","popup.cookieCopy":"Cookie 复制","popup.noSnapshot":"未捕获","popup.ready":"就绪","popup.noActiveTab":"无法获取当前标签页","popup.noData":"暂无数据。前往配置页添加模板和数据。","popup.copySuccess":"已复制 Cookie！","popup.copyFailed":"复制 Cookie 失败","popup.pasteSuccess":"已粘贴 Cookie！","popup.pasteFailed":"粘贴 Cookie 失败","popup.fillSuccess":"已填充 {filled}/{total} 个字段。按钮已点击！","popup.fillPartial":"已填充 {filled}/{total} 个字段。未命中: {missed}","popup.fillFailed":"自动填充失败","popup.clearSuccess":"已清空 Cookie！页面已刷新。","popup.clearPartial":"部分清空：部分 Cookie 删除失败。页面已刷新。","popup.clearFailed":"清空 Cookie 失败","popup.matchBadge":"匹配","config.title":"表单管理","config.subtitle":"管理表单模板和数据，用于自动填充","config.tabTemplates":"模板","config.tabData":"数据","config.save":"保存","config.cancel":"取消","config.confirm":"确认","config.delete":"删除","config.edit":"编辑","config.copy":"复制","config.export":"导出","config.import":"导入","config.searchTemplates":"搜索模板...","config.searchData":"搜索数据...","config.selected":"已选 {count} 项","config.noTemplates":"暂无模板","config.noData":"暂无数据","config.noTableData":"暂无数据","config.actions":"操作","template.new":"新建模板","template.edit":"编辑模板","template.copy":"复制模板","template.name":"名称","template.nameRequired":"名称 *","template.description":"描述","template.url":"网址","template.formFields":"表单字段","template.extract":"提取模板","template.addField":"+ 添加字段","template.fieldName":"字段名称","template.fieldSelector":"CSS 选择器","template.buttonConfig":"自动点击按钮（可选）","template.buttonName":"按钮名称","template.buttonSelector":"CSS 选择器","template.deleteTitle":"删除模板","template.deleteMsg":'确定删除 "{name}"？此操作不可撤销。',"template.deleteBatchTitle":"批量删除模板","template.deleteBatchMsg":"确定删除 {count} 个模板？此操作不可撤销。","template.imported":"已导入 {count} 个模板","template.importFailed":"导入失败：JSON 格式无效","template.deleted":"已删除 {count} 个模板","data.new":"新建数据","data.edit":"编辑数据","data.copy":"复制数据","data.step1":"选择模板","data.step2":"填写数值","data.selectTemplate":"选择一个模板（或手动填写）","data.manual":"手动填写（不使用模板）","data.recordName":"数据名称","data.recordNameRequired":"名称 *","data.fields":"字段","data.noFields":"未定义字段。请选择一个包含字段的模板。","data.next":"下一步","data.back":"上一步","data.deleteTitle":"删除数据","data.deleteMsg":'确定删除 "{name}"？此操作不可撤销。',"data.deleteBatchTitle":"批量删除数据","data.deleteBatchMsg":"确定删除 {count} 条数据？此操作不可撤销。","data.imported":"已导入 {count} 条数据","data.importFailed":"导入失败：JSON 格式无效","data.deleted":"已删除 {count} 条数据","data.extractTemplate":"提取模板","data.templateExtracted":"模板提取成功，请前往模板页查看","data.templateColumn":"来源模板","cookie.title":"Cookie 和存储复制","cookie.enable":"启用跨域 Cookie 和存储复制","cookie.enableDesc":"开启后，可以从一个页面复制 Cookie/Storage 并粘贴到另一个页面。开启后持续生效，直到手动关闭。","cookie.disclaimerTitle":"重要免责声明","cookie.disclaimer1":"此功能会复制源域名下的所有 Cookie（包括 HttpOnly）以及 localStorage/sessionStorage 到目标域名。","cookie.disclaimer2":"请谨慎使用。在不同域名之间复制 Cookie 可能导致意外行为或会话冲突。","cookie.disclaimer3":"此工具仅供开发/测试使用。未经授权，请勿在生产环境中使用。","cookie.disclaimer4":"该功能默认关闭。必须在此页面手动开启后才会生效。","cookie.howtoTitle":"使用方法","cookie.howtoCopy":"在弹窗中按下 Ctrl+C，记录当前页面所有 Cookie 和存储。","cookie.howtoPaste":"在弹窗中按下 Ctrl+V，先清空当前页面 Cookie，再将记录的 Cookie 和存储写入并刷新。","cookie.howtoClear":"在弹窗中按下 Ctrl+D，清空当前页面所有 Cookie 并刷新。","config.tabCookie":"Cookie","config.tabGuide":"用户指南","lang.switch":"English","lang.label":"语言","lang.en":"English","lang.zh":"中文"}};let l="en",r=new Set;function c(e){if(e!==l){l=e;for(const e of r)e()}}function p(){return l}"undefined"!=typeof chrome&&chrome.storage&&(chrome.storage.local.get("settings").then(e=>{const t=e.settings?.language;"en"!==t&&"zh"!==t||c(t)}),chrome.storage.onChanged.addListener(e=>{if(e.settings){const t=e.settings.newValue?.language;"en"!==t&&"zh"!==t||c(t)}}));class d{constructor(e){this._host=e,this._host.addController(this)}hostConnected(){var e;this._unsub=(e=()=>this._host.requestUpdate(),r.add(e),()=>r.delete(e))}hostDisconnected(){this._unsub?.()}t(e,t){return function(e,t){let a=n[l]?.[e]??n.en[e]??e;if(t)for(const[o,s]of Object.entries(t))a=a.replaceAll(`{${o}}`,String(s));return a}(e,t)}}class u{constructor(e){this._listeners=new Set,this._state=e}get state(){return this._state}setState(e){this._state={...this._state,...e},this._notify()}replaceState(e){this._state=e,this._notify()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(){for(const e of this._listeners)e(this._state)}}const h="settings",m={cookieCopyEnabled:!1,dataCardOrder:[],language:"en",popupWidth:600};const f=new class extends u{constructor(){super({...m})}async load(){const e=await chrome.storage.local.get(h);e[h]&&this.replaceState({...m,...e[h]})}async persist(){await chrome.storage.local.set({[h]:this._state})}async setCookieCopyEnabled(e){this.setState({cookieCopyEnabled:e}),await this.persist()}async setDataCardOrder(e){this.setState({dataCardOrder:e}),await this.persist()}async setLanguage(e){this.setState({language:e}),c(e),await this.persist()}get isCookieCopyEnabled(){return this._state.cookieCopyEnabled}get dataCardOrder(){return this._state.dataCardOrder}async setPopupWidth(e){this.setState({popupWidth:e}),await this.persist()}get language(){return this._state.language}get popupWidth(){return this._state.popupWidth}};class g{constructor(e,t,a=!1){this._host=e,this._store=t,this._autoLoad=a,this._host.addController(this)}get state(){return this._store.state}get store(){return this._store}hostConnected(){this._unsubscribe=this._store.subscribe(()=>{this._host.requestUpdate()}),this._autoLoad&&this._store.load()}hostDisconnected(){this._unsubscribe?.()}async load(){await this._store.load()}}function b(){return crypto.randomUUID()}var y=Object.defineProperty,k=Object.getOwnPropertyDescriptor,_=(e,t,a,o)=>{for(var s,i=o>1?void 0:o?k(t,a):t,n=e.length-1;n>=0;n--)(s=e[n])&&(i=(o?s(t,a,i):s(i))||i);return o&&i&&y(t,a,i),i};let C=class extends a{constructor(){super(...arguments),this.value="",this.placeholder="Search...",this.debounceMs=250,this._emit=function(e,t){let a;return(...o)=>{clearTimeout(a),a=setTimeout(()=>e(...o),t)}}(e=>{this.dispatchEvent(new CustomEvent("search-change",{detail:{value:e},bubbles:!0,composed:!0}))},this.debounceMs)}_onInput(e){this.value=e.target.value,this._emit(this.value)}_onKeyDown(e){"Enter"===e.key&&this.dispatchEvent(new CustomEvent("search-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}_clear(){this.value="",this._emit(""),this.requestUpdate()}render(){return o`
      <div class="wrap">
        <span class="icon">&#x1F50D;</span>
        <input
          type="text"
          .value=${this.value}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
        />
        <button class="clear ${this.value?"visible":""}" @click=${this._clear}>&times;</button>
      </div>
    `}};C.styles=e`
    :host { display: block; }
    .wrap { position: relative; display: flex; align-items: center; }
    .icon {
      position: absolute;
      left: 10px;
      color: #94a3b8;
      font-size: 13px;
      pointer-events: none;
    }
    input {
      width: 100%;
      padding: 8px 32px 8px 32px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 400;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
      color: #1e293b;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus {
      border-color: #93c5fd;
      box-shadow: 0 0 0 3px rgba(147,197,253,0.2);
    }
    input::placeholder {
      color: #94a3b8;
      opacity: 1;
    }
    .clear {
      position: absolute; right: 5px;
      background: none; border: none;
      cursor: pointer;
      color: #94a3b8; font-size: 18px;
      line-height: 1; padding: 4px 6px;
      display: none;
      border-radius: 4px;
    }
    .clear.visible { display: block; }
    .clear:hover { color: #64748b; background: #f1f5f9; }
  `,_([t({type:String})],C.prototype,"value",2),_([t({type:String})],C.prototype,"placeholder",2),_([t({type:Number})],C.prototype,"debounceMs",2),C=_([s("search-bar")],C);const x="dataRecords";const S=new class extends u{constructor(){super([])}async load(){const e=((await chrome.storage.local.get(x))[x]??[]).map(e=>({...e,values:Array.isArray(e.values)?e.values:Object.entries(e.values).map(([e,t])=>({name:e,selector:"",value:t}))}));this.replaceState(e)}async persist(){await chrome.storage.local.set({[x]:this._state})}async add(e){const t=Date.now(),a={...e,values:[...e.values],id:b(),order:this._state.length,createdAt:t,updatedAt:t};return this.replaceState([a,...this._state]),await this.persist(),a}async update(e,t){this.replaceState(this._state.map(a=>a.id===e?{...a,...t,values:t.values?[...t.values]:a.values,updatedAt:Date.now()}:a)),await this.persist()}async delete(e){this.replaceState(this._state.filter(t=>t.id!==e)),await this.persist()}async deleteMany(e){const t=new Set(e);this.replaceState(this._state.filter(e=>!t.has(e.id))),await this.persist()}getById(e){return this._state.find(t=>t.id===e)}async reorder(e,t){const a=[...this._state],[o]=a.splice(e,1);a.splice(t,0,o),this.replaceState(a.map((e,t)=>({...e,order:t}))),await this.persist()}async importFrom(e){const t=new Set(this._state.map(e=>e.id)),a=e.filter(e=>!t.has(e.id));return a.length>0&&(this.replaceState([...a,...this._state]),await this.persist()),a.length}};var v=Object.defineProperty,w=Object.getOwnPropertyDescriptor,T=(e,t,a,o)=>{for(var s,i=o>1?void 0:o?w(t,a):t,n=e.length-1;n>=0;n--)(s=e[n])&&(i=(o?s(t,a,i):s(i))||i);return o&&i&&v(t,a,i),i};let D=null,F=0;function N(e,t="info",a=3e3){D?._add(e,t,a)}let O=class extends a{constructor(){super(...arguments),this._toasts=[],this._timers=new Map}connectedCallback(){super.connectedCallback(),D=this}disconnectedCallback(){super.disconnectedCallback(),D=null}_add(e,t,a){const o=F++;this._toasts=[...this._toasts.slice(-3),{id:o,message:e,type:t}],this._toasts.length>4&&(this._toasts=this._toasts.slice(-4));const s=setTimeout(()=>this._remove(o),a);this._timers.set(o,s),this.requestUpdate()}_remove(e){this._toasts=this._toasts.filter(t=>t.id!==e);const t=this._timers.get(e);t&&(clearTimeout(t),this._timers.delete(e)),this.requestUpdate()}_onEnter(e){const t=this._timers.get(e);t&&(clearTimeout(t),this._timers.delete(e))}_onLeave(e){const t=setTimeout(()=>this._remove(e),1500);this._timers.set(e,t)}render(){return this._toasts.map(e=>o`
        <div class="toast ${e.type}" @mouseenter=${()=>this._onEnter(e.id)} @mouseleave=${()=>this._onLeave(e.id)}>
          <span class="msg">${e.message}</span>
          <button class="close" @click=${()=>this._remove(e.id)}>&times;</button>
        </div>
      `)}};O.styles=e`
    :host {
      position: fixed;
      top: 16px;
      right: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 6px;
      pointer-events: none;
    }
    .toast {
      padding: 10px 14px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      pointer-events: auto;
      animation: slideDown 0.25s ease;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
    .toast.error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
    .toast.info    { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
    .toast.warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
    .msg { flex: 1; }
    .close {
      cursor: pointer; background: none; border: none;
      font-size: 16px; line-height: 1; padding: 0;
      color: inherit; opacity: 0.45; flex-shrink: 0; margin-top: 1px;
    }
    .close:hover { opacity: 0.8; }
    @keyframes slideDown {
      from { transform: translateY(-12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,T([i()],O.prototype,"_toasts",2),O=T([s("toast-notification")],O);const E=Object.freeze(Object.defineProperty({__proto__:null,get ToastNotification(){return O},showToast:N},Symbol.toStringTag,{value:"Module"}));export{u as B,d as I,g as S,p as a,N as b,S as d,b as g,f as s,E as t};
