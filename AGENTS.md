# AGENTS.md

This file provides guidance to AI coding assistants (Claude Code, Cursor, GitHub Copilot, etc.) when working with code in this repository.

## 构建命令

```bash
npm run build          # TypeScript 类型检查 + Vite 生产构建 → dist/
npm run dev            # Vite 开发服务器（不做扩展测试用）
npm test               # 运行全部单元测试（vitest）
npm run test:watch     # 测试监听模式
npm run test:coverage  # 测试覆盖率报告
npm run typecheck      # 仅生产代码类型检查
npm run typecheck:tests # 测试代码类型检查（tsconfig.test.json）
npm run check          # typecheck + typecheck:tests + test + build（CI 用这条）
npm install            # 安装依赖
npx tsc --noEmit       # 等价于 npm run typecheck
```

构建后加载扩展：Chrome → `chrome://extensions` → 开发者模式 → 加载已解压的扩展程序 → 选择 `dist/` 目录。`dist/` **不进版本控制**（每次构建产物带 hash，release workflow 会自行构建打包），`docs/TEST_PLAN.md` 含完整手动测试清单。

## 架构概览

这是一个 **Manifest V3** 的 Chrome 浏览器扩展，使用 **Lit Element** Web Components + **Vite 7**（锁定，因 CRXJS 与 Vite 8/Rolldown 不兼容）。构建插件 `@crxjs/vite-plugin`。

### 四个入口（各自独立运行上下文）

| 入口 | 文件 | 作用 |
|------|------|------|
| 弹窗 | `src/popup/popup-app.ts` | 扩展图标弹窗：搜索、数据卡片网格、宽度切换、语言切换、Ctrl+C/V cookie 搬运、Ctrl+D 清空 Cookie、自动填充 |
| 配置页 | `src/config/config-app.ts` | 全屏选项页：模板 CRUD、数据 CRUD、Cookie 开关设置 |
| Service Worker | `src/background/service-worker.ts` | 消息路由：Cookie 复制粘贴/清空、自动填充中转、content script 注入重试 |
| Content Script | `src/content/content-script.ts` | 注入所有页面：仅处理 AUTO_FILL_FORM、GET_PAGE_STORAGE、SET_PAGE_STORAGE。**不再拦截页面快捷键** |

### 状态管理（三层）

1. **`BaseStore<T>`** — 可观察 Store，`setState` 浅合并，`replaceState` 替换，subscribe/notify 模式。
2. **`StoreController`** — Lit `ReactiveController` 桥接。`new StoreController(this, someStore)` 自动订阅，变化触发 `requestUpdate()`。
3. **`chrome.storage.local`** — 持久化。数据在三个 key 下：`settings`、`templates`、`dataRecords`。

模块级单例（`settingsStore`、`templateStore`、`dataRecordStore`）。**每个上下文在打开时各自从 storage 加载一次**：弹窗每次打开都是新上下文所以总是读到最新数据；配置页是长驻标签页，不会自动感知另一个配置页标签的写入（整表覆盖，last-write-wins）。唯一挂监听的是 i18n 语言同步（`chrome.storage.onChanged` → `setLocale`）。语言的真源是 `settingsStore.load()`，i18n 只响应跨上下文变更。

### 数据边界（校验与归一化）

- **写入边界**：单条 JSON 走 `direct-json-import.ts` 的 `parseTemplateJson` / `parseDataRecordJson`；批量导入走 `parseTemplateArrayJson` / `parseDataRecordArrayJson`，逐条校验并返回 `{ items, skipped }`，坏条目被跳过而不是让整次导入失败。值非空却没有 selector 的记录会被拒绝（保存时弹窗拦截并高亮，JSON 导入时抛错）。
- **读取边界**：两个 store 的 `load()` 用 `normalizeTemplate` / `normalizeDataRecord` 逐条归一化，坏条目丢弃并 `console.warn`，永远不会因为一条脏数据把整个列表变成空。
- `importFrom` 接收不可信输入：缺 id/时间戳会补上，重复 id 跳过。
- 文案反馈统一走 `utils/import-feedback.ts`（导入成功/部分跳过/失败三种 toast）。
- **卡片顺序**：`settings.dataCardOrder` 存全量 id 顺序。拖拽只看到当前可见（可能被搜索过滤）的卡片，因此必须用 `utils/order.ts` 的 `mergeVisibleOrder` 把可见子集的新顺序合并回全量，否则隐藏记录的自定义顺序会被覆盖。

### 数据模型

- **Template**：名称、描述、网址、字段列表 `TemplateField[]`（name + CSS selector）、可选按钮配置。
- **DataRecord**：名称、描述、网址、`values: DataFieldValue[]`（`{ name, selector, value }`）、可选按钮覆盖。store 加载时自动迁移旧 `Record<string,string>` 格式。
- 模板下拉框只是快捷填充表单的工具，不是独立模式。草稿恢复时下拉框显示"手动填写"。
- 新记录 prepend 到数组最前面。提取模板打开预填弹窗而非直接创建。

### Cookie/Storage 复制粘贴

- **只在弹窗内操作**，不再拦截页面 Ctrl+C/V/D。受 Cookie 开关控制（`settings.cookieCopyEnabled`）。
- **复制**（弹窗 Ctrl+C）：Service Worker 逐级查询域名层级（`a.b.example.com` → `b.example.com` → `example.com`）的 `chrome.cookies.getAll({ domain })`，合并去重后得到该域名下所有 Cookie（含不同 path、不同子域、HttpOnly、Secure）+ 发 `GET_PAGE_STORAGE` 到 content script 获取 localStorage/sessionStorage，存为快照。storage 获取失败时注入 content script 重试。
- **粘贴**（弹窗 Ctrl+V）：先调用 `removeAllCookies` 清空当前页所有 Cookie（同样逐级域名查询 + 逐条构造 URL 删除），再逐条 `chrome.cookies.set()`。Secure cookie 强制使用 `https://` URL 确保写入成功。作用域规则见 `resolveWriteScope`：同父域子域之间保留 `domain`，跨站粘贴只能写 host-only 并计入 `scopeLost`；分区（CHIPS）Cookie 跳过；源 path 非 `/` 时额外写一份 `path=/` 副本并单独计数（有意为之的近似，写入前按 `name|domain|path` 去重）。之后 `SET_PAGE_STORAGE` 写入 storage，然后 `chrome.tabs.reload`。粘贴后自动清除快照（一次性使用）。
- **清空**（弹窗 Ctrl+D）：`removeAllCookies(url)` 逐级域名查询 + 逐条删除当前 tab 所有 Cookie，全部删除成功绿色 toast，部分失败黄色 toast，全部失败红色 toast。
- 快照存于 `chrome.storage.local` 的 `cookieSnapshot` key，带 30 分钟 TTL（`isSnapshotExpired`，读取时惰性失效）并在 `chrome.runtime.onStartup` 时清除。
- 扩展本地存储**未加密**：表单值与快照都是明文，`inputType: 'password'` 只影响界面遮蔽（README / PRIVACY 已披露）。

### 表单草稿

模板和数据新增表单在弹窗关闭时（`close()`）将当前填写内容保存到模块级内存变量，再次打开时恢复。保存成功后清除草稿。草稿只存表单数据，不存模板选择。

### 自动填充

Content script 按 `DataFieldValue.selector` 查找元素 → `setInputValue` 触发 React/Vue 兼容事件。选择器**为空或语法错误**的字段计入 `invalidSelectors` 并跳过（不做字段名兜底，避免写错输入框），其余字段继续填充，toast 用黄色警告列出被跳过的字段；选择器合法但未命中时才用 `findInputByFieldName` 兜底（按 name/id/placeholder/label/aria-label 匹配），同样计入 `selectorMissed` 而非 `filled`。服务端返回的 `total = filled + failed + selectorMissed + invalidSelectors`。Content script 未加载时自动 `chrome.scripting.executeScript` 注入重试。

### 测试

- **vitest** + **happy-dom**，20 个测试文件，147 个测试用例
- 测试文件命名 `*.test.ts`，放在对应源码目录旁边
- Chrome API mock 在 `src/__tests__/chrome-mock.ts`；`dispatchMessage()` 可直接调用被 mock 捕获的 `chrome.runtime.onMessage` 监听器，用来测 content script / service worker 的整条消息链路
- 测试文件不进生产构建（`tsconfig.json` 的 `exclude`），但**会被类型检查**：`tsconfig.test.json` 覆盖它们，`npm run check` 会跑 `typecheck:tests`（测试文件里的类型错误一样会挡住 CI）
- 不要用 `chrome.cookies.Details`（该类型不存在），删除操作的类型是 `chrome.cookies.CookieDetails`

### 表格排序

三态循环：未排序（上下三角灰色）→ 升序（上蓝下灰）→ 降序（下蓝上灰）。用 CSS flex column + 两个 `<span>` 堆叠三角形。

### Vite/TS 注意事项

- **路径别名**：`@shared`、`@popup`、`@config`、`@services`、`@store`、`@app-types`（不是 `@types`）、`@utils`、`@i18n`
- **Terser**：仅 `drop_debugger`。**严禁** `mangle.properties` 配 `/_/` 正则（破坏 Lit 私有字段）
- **TypeScript**：`experimentalDecorators: true` + `useDefineForClassFields: false`（Lit 3 必需）；`ignoreDeprecations: "6.0"`（baseUrl 已弃用）
- **Lit 独立 chunk**：`manualChunks` 拆出 lit 便于跨更新缓存

### UI 模式速查

做一个新 UI 时直接查表套用，不做像素级推演。

**颜色**：主色 `#2563eb`，危险 `#dc2626`，成功 `#22c55e`，边框 `#e2e8f0`，聚焦光环 `#93c5fd` + `0 0 0 3px rgba(147,197,253,0.2)`

**间距**：表单元素 gap 5px/8px/12px，内容区 padding 8-14px

**圆角**：输入框/按钮 6px，卡片 8px，内容区域 10px

**字体**：`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`，标签 12px/600，正文 13px，按钮 12-13px/500

**按钮**：
- 主按钮: `padding:8px 20px; border-radius:6px; background:#2563eb; color:#fff; border:none`
- 取消按钮: `padding:8px 20px; border-radius:6px; background:#fff; color:#475569; border:1px solid #e2e8f0`
- 禁用: `opacity:0.5; cursor:not-allowed`
- 危险按钮: 文字红色，hover 浅红背景
- 表格操作列: 文字按钮，`font-size:12px`，`gap:6px`，宽度 200px

**表单**：
- 两栏: `.row { display:flex; gap:12px; } .row>*{ flex:1; }`
- 单栏: `.form-group { display:flex; flex-direction:column; gap:5px; }`
- 输入框: `padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; font-size:13px`

**弹窗底部按钮**：`<div slot="footer">` 右对齐，取消在左、确认在右，间距依赖 flex

**Toast**：固定右上角 `top:16px; right:12px; z-index:99999`，4 条上限，hover 暂停自动关闭，`slideDown` 入场动画

**空状态**：居中显示图标 + 文字，`padding:40px 14px; color:#94a3b8`

**卡片网格**：`display:grid; gap:5px; grid-template-columns:repeat(N,1fr)`，N = `Math.round(width/200)`

**表格**：`table-layout:fixed; border-collapse:collapse`，表头 `background:#f8fafc; font-size:12px`，内容溢出省略号 + title tooltip

**Shadow DOM**：所有组件内联 CSS，无外部样式表。样式字符串用 `static styles = css\`...\``

**实现新 UI 时的步骤**：
1. 在现有组件中找最接近的 UI 模式，复制其 CSS
2. 只调整有差异的部分（颜色、间距、尺寸）
3. 不做从零推导
