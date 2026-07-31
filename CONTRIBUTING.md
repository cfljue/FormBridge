# Contributing to FormBridge

Thanks for helping improve FormBridge.

## Before you start

1. Search existing issues and pull requests.
2. Open an issue before large behavioral or architectural changes.
3. Never include real Cookies, passwords, session tokens, or private site data in code, tests, screenshots, or issues.

## Development

```bash
npm install
npm test
npm run build
```

Load `dist/` as an unpacked extension from `chrome://extensions` for manual testing. Follow `TEST_PLAN.md` for browser-level checks.

## Pull requests

- Keep changes focused and explain the user-visible behavior.
- Add or update tests when logic changes.
- Run `npm test` and `npm run build` before submitting.
- Update documentation for new permissions, settings, or workflows.
- Do not weaken TypeScript strictness or introduce remote code execution.

## Commit style

Use concise conventional-style subjects when practical:

- `feat: add ...`
- `fix: handle ...`
- `refactor: simplify ...`
- `docs: explain ...`
- `test: cover ...`

By contributing, you agree that your contributions are licensed under the repository's ISC License.
