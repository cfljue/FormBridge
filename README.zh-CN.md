<p align="center">
  <img src="public/icons/icon-128.png" width="112" height="112" alt="FormBridge 图标">
</p>

<h1 align="center">FormBridge</h1>

<p align="center"><strong>在不同环境间迁移浏览器上下文，几秒完成重复表单。</strong></p>

<p align="center">
  <a href="https://github.com/cfljue/FormBridge/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/cfljue/FormBridge/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/cfljue/FormBridge/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/cfljue/FormBridge"></a>
  <a href="LICENSE"><img alt="ISC 许可证" src="https://img.shields.io/badge/license-ISC-2f9e62"></a>
  <img alt="Chrome Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest_V3-34a66a">
</p>

<p align="center"><a href="README.md">English</a></p>

FormBridge 是一款本地优先的 Chrome 扩展，适合开发、测试、支持团队以及需要频繁填写网页表单的人。它可以把 Cookie 和 Web Storage 从一个页面迁移到另一个页面，也能保存可复用的表单数据，并在匹配页面上快速填充。你的数据不会被发送到远程服务。

> **插件运行时不联网：** FormBridge 不连接开发者服务器，不调用外部 API，也不包含统计分析、遥测或广告。模板、表单数据、设置和临时迁移快照都保存在 Chrome 扩展本地存储中；只有在你主动触发功能时，插件才会与当前网页交互。

> **本地存储未加密：** 表单数据与迁移快照都以明文存放在 Chrome 扩展本地存储中，密码字段类型只做界面遮蔽。快照在粘贴后立即删除，并在 30 分钟未使用或 Chrome 重启后自动失效。

> FormBridge 可以把已登录的浏览器状态写入目标网站。请仅在你有权访问的账号和环境中使用。

## 核心能力

- **迁移浏览器上下文**：捕获 Cookie、`localStorage` 和 `sessionStorage`，再粘贴到另一个页面。
- **可靠填充表单**：使用 CSS 选择器精确定位，并支持 name、placeholder、label、`aria-label` 兜底匹配。
- **复用结构化数据**：创建模板和数据记录，支持搜索、卡片排序以及 JSON 导入导出。
- **兼容现代网页框架**：填充时触发 React、Vue 等框架所需的页面事件。
- **数据留在本地**：记录与临时快照存储在 Chrome 扩展本地空间中，不含统计分析或外部 API 调用。
- **运行时中英文切换**：弹窗和配置页同步切换语言。

## 应用场景

### 重复提交表单与多账号切换

对于需要反复提交的网页表单，可以将字段结构保存为模板，并为不同数据分别建立记录。典型场景是开发环境中的多账号切换登录：为每个测试账号保存一条独立记录，需要切换时直接在弹窗中选择对应账号，无需重复输入相同字段。

### 微前端子应用的本地开发

微前端子应用通常依赖主应用提供登录态和鉴权能力，本地独立运行时往往缺少完整的认证上下文。获得相应环境授权的开发者可以使用 FormBridge，将目标环境中的 Cookie 与 Web Storage 搬运到本地开发页面，使子应用在预期的登录态和鉴权信息下正常运行，而不必在本地重复搭建一套登录与鉴权管理。

### 定制与二次开发

FormBridge 采用宽松的 [ISC 许可证](LICENSE)开源。开发者可以审查完整的运行逻辑，根据团队内部流程调整模板、填充和迁移能力，也可以直接基于本项目代码开发定制版本。发布修改后的版本时，请保留许可证要求的版权与许可声明，并明确说明新增的行为或隐私变化。

## 配套 Skill：自动提取登录表单

仓库内提供了可复用的 [`extract-login-form`](skills/extract-login-form/SKILL.md) Codex Skill，底层仅使用原生 JavaScript 与 Playwright。只需提供登录页网址，也可以附带对目标表单的大致描述；Skill 会识别登录字段和提交按钮、对多个候选表单进行排序，并在对话中直接返回可导入 FormBridge 的模板 JSON。复制结果并粘贴到模板弹窗的“JSON 导入”页签即可，无需下载文件。整个过程不会读取字段值、提交表单，也不会采集 Cookie 或浏览器存储。

该 Skill 支持延迟渲染的 SPA、iframe 分析和多步骤登录页观察模式，也可以脱离扩展单独定制或二次开发。

```bash
npm ci
npx playwright install chromium
```

然后可以告诉 Codex：`使用 skills/extract-login-form 下的 Skill 分析 https://example.com/login`。如果希望在任意项目中通过 `$extract-login-form` 调用，可将该 Skill 目录复制或链接到个人 Codex skills 目录。

## 界面截图

### 数据管理

管理可重复使用的表单数据，适用于重复填表和多账号切换。

![FormBridge 数据管理](docs/images/01-data-management.png)

### 模板管理

为匹配页面配置可复用的字段选择器和提交操作。

![FormBridge 模板管理](docs/images/02-template-management.png)

### Cookie 和存储迁移

显式启用跨页面 Cookie 与 Web Storage 迁移，并在开启前展示完整使用方法和安全提示。

![FormBridge Cookie 和存储迁移设置](docs/images/03-cookie-transfer.png)

### 弹窗工作流

在扩展弹窗中搜索匹配的数据记录并触发表单填充。

![FormBridge 弹窗工作流](docs/images/04-popup-workflow.png)

## 安装

### 从 GitHub Release 安装

1. 在[最新版本](https://github.com/cfljue/FormBridge/releases/latest)下载 `FormBridge-v1.0.0.zip`。
2. 解压文件。
3. 打开 `chrome://extensions`，开启“开发者模式”。
4. 点击“加载已解压的扩展程序”，选择解压后的目录。

Chrome 应用商店版本正在准备中。在商店页面正式上线前，Release 压缩包主要用于审查和开发者模式安装。

### 从源码构建

```bash
npm ci
npm test
npm run build
```

构建完成后，在 `chrome://extensions` 中加载 `dist/` 目录。

## 快速上手

1. 打开扩展选项页，创建一个可复用的表单模板。
2. 基于模板新增数据记录。
3. 打开匹配的网页，从 FormBridge 弹窗中选择记录完成填充。
4. 如需迁移浏览器上下文，先开启 Cookie 迁移；在来源页面的弹窗中按 `Ctrl+C`，再到目标页面按 `Ctrl+V`。

| 弹窗操作 | 效果 |
| --- | --- |
| 点击数据卡片 | 填充当前页面 |
| 点击卡片网址 | 在新标签页打开保存的网址 |
| 拖动卡片 | 调整卡片顺序 |
| `Ctrl+C` | 捕获当前页面的 Cookie 和 Web Storage |
| `Ctrl+V` | 替换目标 Cookie、恢复 Web Storage 并刷新页面 |
| `Ctrl+D` | 清除当前页面的 Cookie 并刷新 |

输入框处于焦点时不会触发快捷键；Cookie 迁移功能也可以随时在设置中关闭。

## 权限说明

| 权限 | 用途 |
| --- | --- |
| `storage` | 在本地保存模板、数据、设置和临时迁移快照 |
| `cookies` | 仅在你主动执行 Cookie 迁移时读取、替换或清除 Cookie |
| `activeTab` | 识别并操作当前活动页面 |
| `scripting` | 必要时注入内容脚本，以恢复页面存储或填充表单 |
| `tabs` | 打开记录的网址、读取当前网址，并在迁移后刷新页面 |
| `<all_urls>` | 让你创建的模板和迁移操作能够用于你选择的任意网站 |

请阅读完整的[隐私政策](docs/PRIVACY.md)和[安全政策](.github/SECURITY.md)。

## 开发

```bash
npm run dev
npm run test:watch
npm run test:coverage
npm run test:skill   # 验证 Playwright 表单分析 Skill
npm run check        # 类型检查、测试和生产构建
```

项目使用 TypeScript strict mode、Lit 3、Vite、CRXJS 与 Vitest。人工发布检查见 [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md)。

## 参与贡献

欢迎提交 Bug、聚焦的功能建议、文档改进和 Pull Request。请先阅读[贡献指南](.github/CONTRIBUTING.md)、[行为准则](.github/CODE_OF_CONDUCT.md)与[更新日志](CHANGELOG.md)。

## 许可证

[ISC](LICENSE) © FormBridge contributors.
