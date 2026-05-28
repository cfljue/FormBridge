import { css } from 'lit';

export const tokens = css`
  :host {
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-primary-light: #eff6ff;
    --color-danger: #dc2626;
    --color-danger-hover: #b91c1c;
    --color-success: #16a34a;
    --color-warning: #d97706;

    --color-bg: #ffffff;
    --color-bg-secondary: #f8fafc;
    --color-bg-hover: #f1f5f9;
    --color-border: #e2e8f0;
    --color-border-focus: #93c5fd;
    --color-text: #1e293b;
    --color-text-secondary: #64748b;
    --color-text-disabled: #94a3b8;

    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 12px;
    --space-lg: 16px;
    --space-xl: 24px;

    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 11px;
    --font-size-sm: 12px;
    --font-size-md: 13px;
    --font-size-lg: 15px;

    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;

    --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);

    --transition-fast: 150ms ease;
  }
`;
