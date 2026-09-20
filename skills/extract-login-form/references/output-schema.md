# Output schema

The analyzer writes pure JSON to stdout. Paste its default `formbridge` output into **Templates → New Template → JSON Import**, not the Data dialog. Copy the JSON content only, without Markdown fences.

## Default: `formbridge`

The default output is a JSON array compatible with FormBridge template import. It contains one merged main-frame template when a suitable candidate exists, otherwise an empty array.

Each template contains `id`, `name`, `description`, `url`, `fields`, an optional `button`, `createdAt`, and `updatedAt`. Each field contains `id`, `name`, `selector`, and an optional `inputType` (`text` or `password`; missing means text). Detected password fields use `inputType: "password"` so data entry is masked. It never includes a field value. Masking is a display setting, not encryption; data JSON still contains original values.

`url` preserves the complete final navigation URL, including query and hash. The current application also uses this value as a substring match against the active page URL. It has no separate navigation URL / matching-pattern fields, so reordered or changed parameters may prevent matching.

`button` configures an automatic click after filling. Missing or ambiguous buttons are omitted with a warning; the user then submits manually. Native form buttons with no `type` are treated as submit controls. Input submit labels are not read from their `value` attribute.

Review generated selectors before importing. Prefer `#id`, `[name="..."]`, stable test attributes, `autocomplete`, and accessible attributes over generated structural paths.

## Detailed: `analysis`

Run with `--format analysis` when candidate ranking or warnings need review.

- `source`: requested URL, final URL, page title, optional hint, and analysis time.
- `observations`: number of DOM observations made.
- `candidates`: ranked form candidates from the main document and attached frames.
- `warnings`: ambiguity, iframe, and compatibility notices.
- `templateValidation`: `passed` when the generated array passes the application's actual `parseTemplateJson`, or `not-applicable` when no template is available. This does not prove selectors will continue working after the page changes.

Each candidate includes its heuristic `score`, frame context, metadata-only fields, and an optional button. Field roles include `username`, `email`, `password`, `one-time-code`, `verification-code`, `phone`, `remember-me`, and `field`.

Fields and buttons expose `selectorUnique` for the observed document and `selectorQuality`: `attribute` for preferred identifying attributes, `heuristic` for classes/placeholder/type fallbacks, or `structural` for DOM paths. These do not guarantee long-term stability. Candidates can include a `buttonWarning` explaining an omitted button.

After manual edits, pipe the final JSON to `node skills/extract-login-form/scripts/validate-template.mjs`. It uses the repository's TypeScript dependency to load the real application parser; keep the Skill in the FormBridge repository with dependencies installed. Template dialogs accept one object or a one-item array, while data dialogs require a `values` array.

## Optional file output

Passing `--output-dir <path>` additionally saves `login-form.analysis.json` and `login-form.formbridge.json`. This is optional; normal Skill use should return stdout JSON directly and must not require a download.
