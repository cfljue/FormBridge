# Chrome Web Store submission checklist

## Ready in this repository

- [x] Manifest V3 production build
- [x] 16×16, 48×48, and 128×128 extension icons
- [x] English and Simplified Chinese listing copy
- [x] Public privacy policy and support URLs
- [x] Permission-purpose explanations
- [x] 440×280 small promotional tile
- [x] 1400×560 marquee promotional tile
- [x] Release ZIP with `manifest.json` at archive root

## Maintainer actions in the Chrome Web Store dashboard

- [ ] Register or sign in to a Chrome Web Store developer account
- [ ] Upload the release ZIP
- [ ] Paste the listing copy from `listing-en.md` and `listing-zh-CN.md`
- [ ] Upload `small-promo-tile.png` and, if desired, `marquee-promo-tile.png`
- [ ] Upload at least one real 1280×800 product screenshot using `screenshots/README.md`
- [ ] Complete the Privacy practices questionnaire using [`docs/PRIVACY.md`](../docs/PRIVACY.md) and the permission explanations below
- [ ] Confirm the single-purpose description: “Move authorized browser context between pages and fill reusable form data.”
- [ ] Confirm that user data is not sold, used for advertising, or sent to external services
- [ ] Submit for review and record the final store URL in both READMEs

## Permission justifications

- **storage** — stores user-created templates, records, settings, and the temporary transfer snapshot locally.
- **cookies** — reads, writes, and clears cookies only when the user triggers Cookie Transfer.
- **activeTab** — identifies the page on which the user requested an action.
- **scripting** — injects the extension content script when needed to fill fields or restore Web Storage.
- **tabs** — reads the active URL, opens saved URLs, and reloads a page after transfer.
- **host access (`<all_urls>`)** — lets user-created templates and explicit transfer actions work on whichever sites the user chooses.
