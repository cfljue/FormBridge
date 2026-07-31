# FormBridge

Chrome 扩展（Manifest V3），面向开发者的表单管理工具箱。

## 功能

- **Cookie / Storage 跨域搬运**：弹窗中 Ctrl+C 捕获当前页面所有 Cookie（含 HttpOnly、Secure）、localStorage、sessionStorage；切换到目标页面 Ctrl+V 一键写入并刷新。粘贴后自动清除快照。Ctrl+D 清空当前页面所有 Cookie 并刷新。
- **表单自动填充**：基于 CSS 选择器的精准填充，支持 name/placeholder/label/aria-label 兜底匹配，兼容 React/Vue 框架事件。可选择器未命中时黄色警告。
- **数据面板**：弹窗内数据卡片网格，按当前页 URL 智能匹配排序，支持拖拽排序、搜索过滤、一键填充跳转。
- **模板管理**：可复用的表单模板（字段名 + CSS 选择器 + 按钮配置），支持导入/导出 JSON。
- **中英双语**：运行时切换，弹窗和配置页状态同步。

## 技术栈

- **Web Components**: Lit Element 3
- **构建**: Vite 7 + @crxjs/vite-plugin（Manifest V3）
- **语言**: TypeScript strict mode
- **测试**: Vitest + happy-dom（79 个用例）
- **存储**: chrome.storage.local
- **包管理**: npm

## 快速开始

```bash
# 安装依赖
npm install

# 开发构建
npm run build

# 运行测试
npm test

# 类型检查
npx tsc --noEmit
```

构建后在 Chrome 加载扩展：
1. 打开 `chrome://extensions`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `dist/` 目录

## 使用指南

### 配置页（右键扩展图标 → 选项）

1. 在「模板」tab 创建表单模板：填写名称、网址、描述，添加字段（字段名 + CSS 选择器），可选配置自动点击按钮
2. 在「数据」tab 创建填充数据：下拉选择模板快速填表，填入各字段的实际值，保存
3. 在「Cookie」tab 开启 Cookie 复制开关

### 弹窗（点击扩展图标）

| 操作 | 效果 |
|------|------|
| 点击绿色卡片 | 自动填充表单 |
| 点击卡片「网址」 | 新标签页打开 |
| 拖拽卡片 | 自定义排序 |
| 搜索框 | 按名称/网址过滤 |
| Ctrl+C | 捕获当前页 Cookie + Storage |
| Ctrl+V | 粘贴到当前页（需先 Ctrl+C） |
| Ctrl+D | 清空当前页所有 Cookie 并刷新 |
| 宽度选择器 | 400 / 600 / 800px |

### 提取模板

在数据页中，对已有关联模板的数据记录点击「提取模板」，可将其字段和按钮配置反向导出为新模板。

## 项目结构

```
form-bridge/
├── src/
│   ├── background/        # Service Worker，消息路由
│   ├── content/           # 注入页面的内容脚本
│   ├── popup/             # 弹窗入口
│   ├── config/            # 配置页入口
│   ├── components/
│   │   ├── shared/        # 公共组件（表格、弹窗、搜索栏、toast 等）
│   │   ├── popup/         # 弹窗专用组件（数据卡片）
│   │   └── config/        # 配置页专用组件（模板/数据管理）
│   ├── store/             # 状态管理（BaseStore + 三个 Store 单例）
│   ├── services/          # Chrome API 封装（storage/cookies/tabs/messaging）
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数（URL 匹配、模糊搜索、防抖、ID 生成）
│   └── i18n/              # 国际化（运行时切换中英文）
├── public/icons/          # 扩展图标
├── TEST_PLAN.md           # 手动测试清单
├── AGENTS.md              # AI 编码助手项目指引
└── vite.config.ts         # Vite 构建配置
```
