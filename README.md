<p align="center">
  <img src="public/icons/icon-128.png" width="112" height="112" alt="FormBridge icon">
</p>

<h1 align="center">FormBridge</h1>

<p align="center"><strong>Move browser context between environments. Fill repetitive forms in seconds.</strong></p>

<p align="center">
  <a href="https://github.com/cfljue/FormBridge/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/cfljue/FormBridge/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/cfljue/FormBridge/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/cfljue/FormBridge"></a>
  <a href="LICENSE"><img alt="ISC license" src="https://img.shields.io/badge/license-ISC-2f9e62"></a>
  <img alt="Chrome Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest_V3-34a66a">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6">
</p>

<p align="center"><a href="README.zh-CN.md">简体中文</a></p>

FormBridge is a local-first Chrome extension for developers, testers, support teams, and anyone who repeatedly works with browser forms. It copies cookies and Web Storage from one page to another, stores reusable form profiles, and fills matching pages without sending your data to a remote service.

> **No external network access:** FormBridge does not connect to a developer-operated server, call external APIs, or include analytics, telemetry, or advertising. Templates, form values, settings, and transfer snapshots remain in Chrome's local extension storage. The extension only interacts with pages when you trigger its features.

> FormBridge can expose authenticated browser state on the destination site. Use it only with accounts and environments you are authorized to access.

## Why FormBridge?

- **Move browser context** — capture cookies, `localStorage`, and `sessionStorage`, then paste them into another page.
- **Fill forms reliably** — target fields with CSS selectors, with fallbacks for name, placeholder, label, and `aria-label`.
- **Reuse structured profiles** — create templates and data records, search them, reorder cards, and import or export JSON.
- **Work with modern apps** — form updates dispatch the events expected by React, Vue, and similar frameworks.
- **Keep data local** — records and snapshots stay in Chrome extension storage; FormBridge has no analytics or external API calls.
- **Switch languages at runtime** — English and Simplified Chinese are built in.

## Use cases

### Repeated form submission and account switching

Save reusable form templates and data records for pages that need to be submitted repeatedly. A typical development workflow is switching between multiple test accounts: keep a separate record for each account, then select the one you need from the popup instead of re-entering the same fields every time.

### Local micro-frontend development

Micro-frontend child applications often rely on a host application for login state and authorization, so they cannot run independently during local development. With FormBridge, an authorized developer can copy the target environment's cookies and Web Storage to the local development page, allowing the child application to run against the expected authenticated context without rebuilding login and authorization management locally.

### Custom workflows and secondary development

FormBridge is open source under the permissive [ISC License](LICENSE). Developers can audit the complete runtime behavior, adapt templates and transfer logic to internal workflows, or use the codebase as the foundation for a customized extension. If you redistribute a modified version, keep the required copyright and license notice and clearly document any behavior or privacy changes you introduce.

## Screenshots

Real product screenshots are being prepared for the first public release. See [`store-assets/screenshots/README.md`](store-assets/screenshots/README.md) for the exact capture checklist.

## Install

### GitHub Release

1. Download `FormBridge-v1.0.0.zip` from the [latest release](https://github.com/cfljue/FormBridge/releases/latest).
2. Extract the archive.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Choose **Load unpacked** and select the extracted folder.

Chrome Web Store distribution is planned. Until the listing is live, the release archive is intended for review and developer-mode installation.

### Build from source

```bash
npm ci
npm test
npm run build
```

Then load the generated `dist/` directory from `chrome://extensions`.

## Quick start

1. Open the extension options and create a reusable form template.
2. Add a data record based on that template.
3. Open a matching page and choose the record from the FormBridge popup to fill it.
4. To move browser context, enable Cookie Transfer, open the source page and press `Ctrl+C` in the popup; open the destination page and press `Ctrl+V`.

| Popup action | Result |
| --- | --- |
| Click a data card | Fill the current page |
| Click a card URL | Open the saved URL in a new tab |
| Drag a card | Change card order |
| `Ctrl+C` | Capture cookies and Web Storage from the current page |
| `Ctrl+V` | Replace destination cookies and restore Web Storage, then reload |
| `Ctrl+D` | Clear cookies for the current page, then reload |

Keyboard shortcuts are ignored while a text field is focused. Cookie Transfer can be disabled at any time from settings.

## Permissions

FormBridge requests only the browser capabilities needed for its core workflows:

| Permission | Why it is needed |
| --- | --- |
| `storage` | Save templates, records, preferences, and the temporary transfer snapshot locally |
| `cookies` | Read, replace, and clear cookies when you explicitly use Cookie Transfer |
| `activeTab` | Identify and interact with the page you are currently using |
| `scripting` | Restore page storage or fill a form when the content script needs to be injected |
| `tabs` | Open saved URLs, read the active tab URL, and reload after a transfer |
| `<all_urls>` | Allow the same user-created template and transfer workflow to work on any site you choose |

Read the full [Privacy Policy](PRIVACY.md) and [Security Policy](SECURITY.md).

## Development

```bash
npm run dev          # development server
npm run test:watch   # watch tests
npm run test:coverage
npm run check        # type-check, test, and production build
```

The project uses TypeScript strict mode, Lit 3, Vite, CRXJS, and Vitest. Manual release checks are documented in [`TEST_PLAN.md`](TEST_PLAN.md).

## Contributing

Bug reports, focused feature proposals, documentation fixes, and pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), follow the [Code of Conduct](CODE_OF_CONDUCT.md), and review the [changelog](CHANGELOG.md) before submitting a change.

## License

[ISC](LICENSE) © FormBridge contributors.
