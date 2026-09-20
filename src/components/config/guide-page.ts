import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nController, getLocale } from '@i18n/index';
import type { Locale } from '@i18n/index';

type Section = { id: string; title: string; body: ReturnType<typeof html> };
type Page = { id: string; title: string; sections: Section[] };
type Content = { title: string; intro: string; tocTitle: string; pages: Page[]; tips: Section };

const content: Record<Locale, Content> = {
  zh: {
    title: '用户指南',
    tocTitle: '目录',
    intro: 'FormBridge 是一款 Chrome 浏览器扩展，提供两大核心功能：<strong>表单自动填充</strong>和<strong>Cookie 跨域复制</strong>。',
    pages: [
      {
        id: 'popup', title: '弹窗页',
        sections: [
          { id: 'popup-overview', title: '界面概览', body: html`
            <p>点击浏览器工具栏的扩展图标即可打开弹窗。从上到下分为三个区域：</p>
            <ul>
              <li><strong>搜索栏</strong> — 按名称或网址过滤数据卡片。</li>
              <li><strong>工具栏</strong> — 宽度选择器（400 / 600 / 800px）、语言切换按钮、"配置"按钮（打开完整的配置管理页面）。</li>
              <li><strong>卡片区</strong> — 每条数据以卡片展示，显示名称和一个"URL"按钮（点击跳转到记录中的网址）。</li>
            </ul>
            <p><strong>卡片匹配规则：</strong>打开弹窗时，扩展将当前页面网址与每条数据的 URL 做<em>包含匹配</em>。匹配的卡片显示<span style="color:#16a34a;font-weight:600;">绿色边框</span>并排在最前面，点击触发自动填充；不匹配的卡片以 50% 透明度排在后面，点击无效果。</p>
            <p><strong>拖拽排序：</strong>匹配卡片左侧有拖拽手柄（☰），拖动可调整卡片顺序，排序结果自动保存。</p>
          `},
          { id: 'popup-autofill', title: '自动填充', body: html`
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
          `},
          { id: 'popup-cookie', title: 'Cookie 快捷键', body: html`
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
          `},
        ],
      },
      {
        id: 'config', title: '配置页',
        sections: [
          { id: 'config-data', title: '数据 Tab', body: html`
            <p>数据记录保存了要填充到表单中的<strong>实际值</strong>。每条数据包含名称、网址、以及字段值列表。</p>
            <p><strong>创建数据有两种方式：</strong></p>
            <ol>
              <li><strong>基于模板</strong> — 在向导中选择已有模板，扩展自动加载字段结构，只需填入各字段的值。模板的网址和描述也会自动带入。</li>
              <li><strong>手动填写</strong> — 不依赖模板，自行定义字段名和值。适合快速测试或无模板可用的场景。</li>
            </ol>
            <p>向导支持<strong>草稿保存</strong>：新建模式下误关弹窗，内容不会丢失，重新打开自动恢复。</p>
            <p>每条数据支持的操作：<strong>编辑、复制、删除、导出 JSON、提取模板</strong>。"提取模板"可根据已有数据逆向生成模板。</p>
          `},
          { id: 'config-template', title: '模板 Tab', body: html`
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
          `},
          { id: 'config-cookie', title: 'Cookie Tab', body: html`
            <p>管理 Cookie 跨域复制功能的<strong>开关</strong>。</p>
            <ul>
              <li><strong>功能开关</strong> — 开启后弹窗中的 Ctrl+C/V/D 快捷键生效，关闭后无响应。</li>
              <li><strong>快捷键参考</strong> — 列出三个快捷键及作用。</li>
              <li><strong>免责声明</strong> — 说明复制范围（包括 HttpOnly Cookie 和所有父级域名）、风险（会话冲突）、适用场景（仅供开发/测试）。</li>
            </ul>
            <p>粘贴时的实际行为（有意保留的近似）：</p>
            <ul>
              <li><strong>同父域子域之间保留域作用域</strong> — 来源是父域 Cookie（如 <code>.example.com</code>）且目标仍是该父域的子域时，按原域写入，同父域下的登录态可继续共享。</li>
              <li><strong>跨站粘贴会收紧作用域</strong> — 目标换成完全不同的站点（如 <code>example.com</code> → <code>localhost</code>）时只能写成目标主机的 host-only Cookie，父域作用域无法保留，提示里会告知有多少条如此处理。</li>
              <li><strong>额外写入 <code>path=/</code> 副本</strong> — 源 Cookie 的 path 不是 <code>/</code> 时会再写一份 <code>path=/</code> 副本，让它在目标站所有路径下都能发送；这是为跨站调试做的近似，会在提示里单独计数。</li>
              <li><strong>分区 Cookie（CHIPS）不复制</strong> — 带分区键的 Cookie 会被跳过并计入提示。</li>
            </ul>
            <p>Cookie 快照保存在扩展本地存储中：<strong>粘贴一次后立即清除，30 分钟未使用或浏览器重启后也会自动失效</strong>。</p>
          `},
          { id: 'config-batch', title: '批量操作', body: html`
            <p>在数据或模板管理页面勾选表格行复选框进入批量模式，工具栏显示已选数量并提供三个按钮：</p>
            <ul>
              <li><strong>导入</strong> — 选择 .json 文件批量导入，重复 ID 自动跳过；格式不合法的条目会被跳过并在提示里说明原因，合法条目照常导入。</li>
              <li><strong>导出</strong> — 选中项导出为 <code>data-records-YYYY-MM-DD.json</code> 或 <code>templates-YYYY-MM-DD.json</code>。</li>
              <li><strong>批量删除</strong> — 确认后一次性删除所有选中项，不可撤销。</li>
            </ul>
            <p>每行操作列也有单独的<strong>导出</strong>按钮，可导出单条记录。</p>
          `},
        ],
      },
    ],
    tips: { id: 'tips', title: '注意事项与技巧', body: html`
      <ul>
        <li><strong>CSS 选择器越简单越好。</strong>优先使用 <code>#id</code> 或 <code>[name="xxx"]</code>，避免超长层级选择器。</li>
        <li><strong>URL 匹配是包含关系。</strong>数据 URL 设为 <code>example.com/login</code> 即可匹配该域名下所有登录页变体。</li>
        <li><strong>Cookie 功能默认关闭。</strong>出于安全考虑，安装后需手动在 Cookie Tab 中开启。</li>
        <li><strong>修改即时生效。</strong>所有增删改操作立即生效，无需重启扩展或刷新页面。</li>
        <li><strong>弹窗宽度可调。</strong>在弹窗工具栏切换 400/600/800px，卡片列数自动适配。</li>
        <li><strong>拖拽排序持久化。</strong>卡片顺序自动保存，下次打开保持一致。</li>
        <li><strong>误关弹窗不丢内容。</strong>新建数据/模板时关闭弹窗，重新打开自动恢复草稿。</li>
        <li><strong>选择器失效有回退。</strong>CSS 选择器未命中时扩展会按字段名自动回退匹配。</li>
        <li><strong>选择器留空或写错会被跳过。</strong>这类字段不做字段名回退（避免把值写进无关输入框），其余字段照常填充，填充结果以黄色提示列出被跳过的字段；数据记录里"填了值却没填选择器"的行在保存时会被拦下。</li>
      </ul>
    `},
  },

  /* ================================================================ */
  en: {
    title: 'User Guide',
    tocTitle: 'Contents',
    intro: 'FormBridge is a Chrome extension with two core features: <strong>Form Auto-fill</strong> and <strong>Cross-domain Cookie Copy</strong>.',
    pages: [
      {
        id: 'popup', title: 'Popup',
        sections: [
          { id: 'popup-overview', title: 'Interface Overview', body: html`
            <p>Click the extension icon in the browser toolbar to open the popup. Three areas from top to bottom:</p>
            <ul>
              <li><strong>Search bar</strong> — Filter data cards by name or URL.</li>
              <li><strong>Toolbar</strong> — Width selector (400 / 600 / 800px), language toggle, and a "Configure" button that opens the full config page.</li>
              <li><strong>Card grid</strong> — Each data record shown as a card with its name and a "URL" button (opens the record's URL in a new tab).</li>
            </ul>
            <p><strong>Card matching:</strong> When the popup opens, the extension checks if the current page URL <em>contains</em> each data record's URL. Matched cards show a <span style="color:#16a34a;font-weight:600;">green border</span> and appear first — clicking triggers auto-fill. Unmatched cards are dimmed at 50% opacity; clicking has no effect.</p>
            <p><strong>Drag to reorder:</strong> Matched cards have a drag handle (☰) on the left. Drag to reorder — the order is saved automatically.</p>
          `},
          { id: 'popup-autofill', title: 'Auto-fill', body: html`
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
          `},
          { id: 'popup-cookie', title: 'Cookie Shortcuts', body: html`
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
          `},
        ],
      },
      {
        id: 'config', title: 'Config Page',
        sections: [
          { id: 'config-data', title: 'Data Tab', body: html`
            <p>Data records contain the <strong>actual values</strong> to fill into forms. Each record has a name, URL, and a list of field values.</p>
            <p><strong>Two ways to create data:</strong></p>
            <ol>
              <li><strong>From a template</strong> — Select an existing template in the wizard. The field structure is loaded automatically; you just fill in values. The template's URL and description are also copied.</li>
              <li><strong>Manual entry</strong> — Define field names and values yourself, without a template. Useful for quick tests.</li>
            </ol>
            <p>The wizard supports <strong>draft saving</strong>: closing the modal without saving preserves your content, restored on next open.</p>
            <p>Row actions: <strong>Edit, Copy, Delete, Export JSON, Extract Template</strong>. "Extract Template" reverse-engineers a template from the data record.</p>
          `},
          { id: 'config-template', title: 'Template Tab', body: html`
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
          `},
          { id: 'config-cookie', title: 'Cookie Tab', body: html`
            <p>Manages the <strong>master switch</strong> for cross-domain cookie copy.</p>
            <ul>
              <li><strong>Toggle</strong> — When enabled, Ctrl+C/V/D shortcuts in the popup become active.</li>
              <li><strong>Shortcut reference</strong> — Lists the three shortcuts and their functions.</li>
              <li><strong>Disclaimer</strong> — Documents the copy scope (including HttpOnly cookies and all parent domains), risks, and intended use (development/testing only).</li>
            </ul>
            <p>What pasting actually does (deliberate approximations included):</p>
            <ul>
              <li><strong>Keeps the domain scope between sibling subdomains</strong> — when the source is a parent-domain cookie (e.g. <code>.example.com</code>) and the target is still a subdomain of it, the original domain is kept so the login state keeps working across that parent domain.</li>
              <li><strong>Cross-site paste narrows the scope</strong> — when the target is a different site (e.g. <code>example.com</code> → <code>localhost</code>), the cookie can only be written host-only for the target host; the parent-domain scope cannot be carried over, and the toast tells you how many cookies were affected.</li>
              <li><strong>An extra <code>path=/</code> copy</strong> — when a source cookie's path is not <code>/</code>, another copy at <code>path=/</code> is written so it is sent on every path of the target site. This is an intentional approximation for cross-site debugging and is counted separately in the toast.</li>
              <li><strong>Partitioned (CHIPS) cookies are not copied</strong> — cookies with a partition key are skipped and counted in the toast.</li>
            </ul>
            <p>Snapshots live in extension local storage: <strong>they are cleared right after a paste, and expire after 30 minutes of not being used or when the browser restarts</strong>.</p>
          `},
          { id: 'config-batch', title: 'Batch Operations', body: html`
            <p>Check table row boxes to enter batch mode. The toolbar shows the selected count and three buttons:</p>
            <ul>
              <li><strong>Import</strong> — Select a .json file to batch import. Duplicate IDs are skipped, and invalid entries are skipped with the reason reported while the valid ones still import.</li>
              <li><strong>Export</strong> — Download selected items as <code>data-records-YYYY-MM-DD.json</code> or <code>templates-YYYY-MM-DD.json</code>.</li>
              <li><strong>Batch delete</strong> — Confirm then delete all selected items. Cannot be undone.</li>
            </ul>
            <p>Each row also has an individual <strong>Export</strong> button for single-record export.</p>
          `},
        ],
      },
    ],
    tips: { id: 'tips', title: 'Tips & Notes', body: html`
      <ul>
        <li><strong>Keep CSS selectors simple.</strong> Prefer <code>#id</code> or <code>[name="xxx"]</code> over long hierarchical selectors.</li>
        <li><strong>URL matching is substring-based.</strong> A data URL of <code>example.com/login</code> matches all login page variants under that domain.</li>
        <li><strong>Cookie feature is off by default.</strong> Enable it manually in the Cookie tab after installation.</li>
        <li><strong>Changes take effect immediately.</strong> All create/edit/delete operations are instant — no need to reload.</li>
        <li><strong>Adjustable popup width.</strong> Switch between 400, 600, and 800px in the popup toolbar; card columns adapt.</li>
        <li><strong>Card order is persistent.</strong> Drag-and-drop order is saved and restored across sessions.</li>
        <li><strong>Drafts survive accidental close.</strong> Re-opening the modal restores unsaved content.</li>
        <li><strong>Selector fallback.</strong> If the CSS selector doesn't match, the extension tries field-name-based fallback.</li>
        <li><strong>Empty or malformed selectors are skipped.</strong> Such fields are not name-matched (that could write the value into an unrelated input); the remaining fields still fill, and the skipped ones are listed in a yellow warning. Data rows that have a value but no selector are rejected on save.</li>
      </ul>
    `},
  },
};

@customElement('guide-page')
export class GuidePage extends LitElement {
  static styles = css`
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
  `;

  private _i18n = new I18nController(this);

  private _scrollTo(id: string) {
    const el = this.shadowRoot?.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private _pageDotClass(pageIndex: number) {
    return pageIndex === 0 ? 'popup' : 'config';
  }

  render() {
    const locale = getLocale();
    const c = content[locale] ?? content.en;
    return html`
      <nav class="sidebar">
        <h4>${c.tocTitle}</h4>
        <ul class="toc-list">
          ${c.pages.map((page, pi) => html`
            <li>
              <span class="toc-page" @click=${() => this._scrollTo(page.id)}>
                <span class="dot ${this._pageDotClass(pi)}"></span>${page.title}
              </span>
              <ul class="toc-subs">
                ${page.sections.map(s => html`
                  <li @click=${() => this._scrollTo(s.id)}>${s.title}</li>
                `)}
              </ul>
            </li>
          `)}
          <li>
            <span class="toc-page" @click=${() => this._scrollTo(c.tips.id)}>
              <span class="dot tips"></span>${c.tips.title}
            </span>
          </li>
        </ul>
      </nav>

      <div class="content">
        <h2>${c.title}</h2>
        <p class="intro">${c.intro}</p>

        ${c.pages.map((page, pi) => html`
          <div class="page-header" id=${page.id}>
            <span class="dot ${this._pageDotClass(pi)}"></span>
            <h3>${page.title}</h3>
          </div>
          ${page.sections.map(s => html`
            <div class="section" id=${s.id}>
              <h4>${s.title}</h4>
              ${s.body}
            </div>
          `)}
        `)}

        <div class="tips-section" id=${c.tips.id}>
          <h4>${c.tips.title}</h4>
          ${c.tips.body}
        </div>
      </div>
    `;
  }
}
