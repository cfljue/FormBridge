import type { FieldInputType } from '@app-types/models';

/**
 * Reads inputType from imported JSON, rejecting unknown values so a typo like "file" fails
 * validation instead of being silently ignored.
 */
export function requireInputType(value: unknown): { inputType?: FieldInputType } {
  if (value === undefined) return {};
  if (value !== 'text' && value !== 'password') throw new Error('inputType must be text or password.');
  return { inputType: value };
}

/** Reads inputType from already-stored data, dropping unknown values instead of failing. */
export function sanitizeInputType(value: unknown): { inputType?: FieldInputType } {
  return value === 'text' || value === 'password' ? { inputType: value } : {};
}
