import { parseJsonArray } from '@utils/json-file';
import { requireInputType } from '@utils/field-input-type';
import type { DataFieldValue, DataRecord, Template, TemplateField } from '@app-types/models';

export type TemplateInput = Omit<Template, 'id' | 'createdAt' | 'updatedAt'>;
export type DataRecordInput = Omit<DataRecord, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

/** Import payload: identity and timestamps are optional and re-assigned by the store when missing. */
export type TemplateImportItem = TemplateInput & Pick<Partial<Template>, 'id' | 'createdAt' | 'updatedAt'>;
export type DataRecordImportItem = DataRecordInput & Pick<Partial<DataRecord>, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

export interface BatchParseResult<T> {
  items: T[];
  /** Entries that failed validation, reported by their position in the imported array. */
  skipped: Array<{ index: number; error: string }>;
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

function parseRoot(content: string): unknown {
  if (!content.trim()) throw new Error('Paste JSON before saving.');
  return JSON.parse(content);
}

/** A bare object or a one-element array — what the single-item dialogs accept. */
function singleItem(content: string): Record<string, unknown> {
  const parsed = parseRoot(content);
  if (!Array.isArray(parsed)) return asRecord(parsed, 'JSON');
  if (parsed.length !== 1) throw new Error('Import exactly one item in this dialog.');
  return asRecord(parsed[0], 'Array item');
}

/** A JSON array of objects — what batch import accepts. */
function batchItems(content: string): unknown[] {
  const parsed = parseRoot(content);
  if (!Array.isArray(parsed)) throw new Error('Invalid JSON array');
  return parsed;
}

function parseEach<T>(raw: unknown[], parseOne: (item: unknown, index: number) => T): BatchParseResult<T> {
  const items: T[] = [];
  const skipped: BatchParseResult<T>['skipped'] = [];

  raw.forEach((item, index) => {
    try {
      items.push(parseOne(item, index));
    } catch (error) {
      skipped.push({ index, error: error instanceof Error ? error.message : String(error) });
    }
  });

  return { items, skipped };
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function templateFromRecord(item: Record<string, unknown>): TemplateInput {
  if (!Array.isArray(item.fields)) throw new Error('fields must be an array.');

  const fields: TemplateField[] = item.fields.map((value, index) => {
    const field = asRecord(value, `fields[${index}]`);
    return {
      id: optionalString(field.id) || crypto.randomUUID(),
      name: requiredString(field.name, `fields[${index}].name`),
      selector: optionalString(field.selector),
      ...requireInputType(field.inputType),
    };
  });

  let button: TemplateInput['button'];
  if (item.button !== undefined && item.button !== null) {
    const source = asRecord(item.button, 'button');
    const selector = optionalString(source.selector);
    if (selector) button = { name: optionalString(source.name) || 'Submit', selector };
  }

  return {
    name: requiredString(item.name, 'name'),
    description: optionalString(item.description),
    url: optionalString(item.url),
    fields,
    button,
  };
}

function dataRecordFromRecord(item: Record<string, unknown>): DataRecordInput {
  if (!Array.isArray(item.values)) throw new Error('values must be an array.');

  const values: DataFieldValue[] = item.values.map((value, index) => {
    const field = asRecord(value, `values[${index}]`);
    const selector = optionalString(field.selector);
    const fieldValue = typeof field.value === 'string' ? field.value : '';
    // A value without a selector can never be filled, so it is rejected at the boundary
    // instead of being stored as dead data.
    if (fieldValue.trim() !== '' && selector === '') {
      throw new Error(`values[${index}].selector is required when a value is set.`);
    }
    return {
      name: requiredString(field.name, `values[${index}].name`),
      selector,
      value: fieldValue,
      ...requireInputType(field.inputType),
    };
  });

  return {
    name: requiredString(item.name, 'name'),
    description: optionalString(item.description),
    url: optionalString(item.url),
    templateId: optionalString(item.templateId),
    values,
    buttonName: optionalString(item.buttonName) || undefined,
    buttonSelector: optionalString(item.buttonSelector) || undefined,
  };
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function identityOf(source: Record<string, unknown>): { id?: string; createdAt?: number; updatedAt?: number } {
  const id = optionalString(source.id);
  return {
    id: id || undefined,
    createdAt: optionalNumber(source.createdAt),
    updatedAt: optionalNumber(source.updatedAt),
  };
}

/** Accepts one object or a single-item array — used by the create/edit dialogs. */
export function parseTemplateJson(content: string): TemplateInput {
  return templateFromRecord(singleItem(content));
}

export function parseDataRecordJson(content: string): DataRecordInput {
  return dataRecordFromRecord(singleItem(content));
}

/** Accepts a JSON array — used by batch import. Invalid entries are reported, not fatal. */
export function parseTemplateArrayJson(content: string): BatchParseResult<TemplateImportItem> {
  return parseEach(batchItems(content), (item, index) => {
    const record = asRecord(item, `Item ${index + 1}`);
    return { ...templateFromRecord(record), ...identityOf(record) };
  });
}

export function parseDataRecordArrayJson(content: string): BatchParseResult<DataRecordImportItem> {
  return parseEach(batchItems(content), (item, index) => {
    const record = asRecord(item, `Item ${index + 1}`);
    return { ...dataRecordFromRecord(record), ...identityOf(record), order: optionalNumber(record.order) };
  });
}
