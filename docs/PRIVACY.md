# FormBridge Privacy Policy

Last updated: July 31, 2026

FormBridge is a local-first browser extension for form autofill and authorized Cookie/Storage transfer between pages.

## Data handled by the extension

FormBridge may process the following data when you explicitly use its features:

- Form templates and values you save
- Cookies for the active page, including HttpOnly cookies
- `localStorage` and `sessionStorage` values for the active page
- The URL and hostname of the active page
- Extension preferences such as language and popup width

## How data is used

The data is used only to provide the requested autofill, navigation, Cookie transfer, and page-storage transfer features.

## Storage and transmission

- Saved templates, form values, settings, and temporary transfer snapshots are stored locally using `chrome.storage.local`.
- FormBridge does not include analytics, telemetry, advertising, or tracking.
- FormBridge does not send saved form values, Cookies, Storage values, or browsing data to the developer or to third-party servers.
- Data may be written to a target page only when you explicitly trigger an autofill or paste operation.

## Data retention and deletion

- Templates and form data remain on the device until you edit, delete, import over, or uninstall the extension.
- A Cookie/Storage transfer snapshot remains local until it is pasted, replaced by another snapshot, cleared by extension data removal, or the extension is uninstalled.
- Uninstalling the extension causes Chrome to remove its local extension storage according to Chrome's platform behavior.

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Store settings, templates, form records, and temporary transfer snapshots locally. |
| `cookies` | Read, write, and remove Cookies when the user invokes copy, paste, or clear. |
| `activeTab` / `tabs` | Identify the active page, reload it after transfer, and open saved URLs. |
| `scripting` | Re-inject the content script when a page has not loaded it yet. |
| `<all_urls>` | Enable autofill and user-triggered Cookie/Storage operations on arbitrary sites. |

## Your responsibilities

Only transfer sessions or fill forms on systems you own or are authorized to test. Cookies and form values may contain sensitive information. Do not share exported data files publicly.

## Changes

Material privacy changes will be documented in the repository and release notes.

## Contact

For privacy questions, open a private security report or contact the maintainer through the repository: https://github.com/cfljue/FormBridge
