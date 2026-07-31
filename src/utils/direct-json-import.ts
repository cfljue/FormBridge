import type { DataFieldValue, DataRecord, Template, TemplateField } from '@app-types/models';

export type TemplateInput = Omit<Template, 'id' | 'createdAt' | 'updatedAt'>;
export type DataRecordInput = Omit<DataRecord, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

function singleRecord(content: string): Record<string, unknown> {
  if (!content.trim()) throw new Error('Paste JSON before saving.');

  const parsed: unknown = JSON.parse(content);
  if (!Array.isArray(parsed)) return asRecord(parsed, 'JSON');
  if (parsed.length !== 1) throw new Error('Import exactly one item in this dialog.');
  return asRecord(parsed[0], 'Array item');
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseTemplateJson(content: string): TemplateInput {
  const item = singleRecord(content);
  if (!Array.isArray(item.fields)) throw new Error('fields must be an array.');

  const fields: TemplateField[] = item.fields.map((value, index) => {
    const field = asRecord(value, `fields[${index}]`);
    return {
      id: optionalString(field.id) || crypto.randomUUID(),
      name: requiredString(field.name, `fields[${index}].name`),
      selector: optionalString(field.selector),
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

export function parseDataRecordJson(content: string): DataRecordInput {
  const item = singleRecord(content);
  if (!Array.isArray(item.values)) throw new Error('values must be an array.');

  const values: DataFieldValue[] = item.values.map((value, index) => {
    const field = asRecord(value, `values[${index}]`);
    return {
      name: requiredString(field.name, `values[${index}].name`),
      selector: optionalString(field.selector),
      value: typeof field.value === 'string' ? field.value : '',
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
