import { t } from '@i18n/index';
import { showToast } from '@shared/toast-notification';
import type { BatchParseResult } from '@utils/direct-json-import';

const KEYS = {
  template: {
    imported: 'template.imported',
    skipped: 'template.importSkipped',
    failed: 'template.importFailed',
  },
  data: {
    imported: 'data.imported',
    skipped: 'data.importSkipped',
    failed: 'data.importFailed',
  },
} as const;

/**
 * Reports a batch import: how many entries were stored and how many were rejected, with the
 * first rejection reason. A partially accepted file still counts as a warning, not a success.
 */
export function reportBatchImport(
  kind: 'template' | 'data',
  parsed: BatchParseResult<unknown>,
  imported: number
): void {
  const keys = KEYS[kind];
  const skipped = parsed.skipped.length;

  if (skipped === 0) {
    showToast(t(keys.imported, { count: imported }), 'success');
    return;
  }

  const message = t(keys.skipped, {
    imported,
    skipped,
    reason: parsed.skipped[0].error,
  });
  showToast(message, imported > 0 ? 'warning' : 'error');
}

export function reportImportFailure(kind: 'template' | 'data'): void {
  showToast(t(KEYS[kind].failed), 'error');
}
