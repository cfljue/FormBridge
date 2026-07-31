# Output schema

The analyzer writes pure JSON to stdout. Its default `formbridge` format is designed to be copied directly from the conversation and pasted into FormBridge’s **JSON Import** tab.

## Default: `formbridge`

The default output is a JSON array compatible with FormBridge template import. It contains one merged main-frame template when a suitable candidate exists, otherwise an empty array.

Each template contains `id`, `name`, `description`, `url`, `fields`, an optional `button`, `createdAt`, and `updatedAt`. Each field contains `id`, `name`, and `selector`. It never includes a field value.

Review generated selectors before importing. Prefer `#id`, `[name="..."]`, stable test attributes, `autocomplete`, and accessible attributes over generated structural paths.

## Detailed: `analysis`

Run with `--format analysis` when candidate ranking or warnings need review.

- `source`: requested URL, final URL, page title, optional hint, and analysis time.
- `observations`: number of DOM observations made.
- `candidates`: ranked form candidates from the main document and attached frames.
- `warnings`: ambiguity, iframe, and compatibility notices.

Each candidate includes its heuristic `score`, frame context, metadata-only fields, and an optional button. Field roles include `username`, `email`, `password`, `one-time-code`, `verification-code`, `phone`, `remember-me`, and `field`.

## Optional file output

Passing `--output-dir <path>` additionally saves `login-form.analysis.json` and `login-form.formbridge.json`. This is optional; normal Skill use should return stdout JSON directly and must not require a download.
