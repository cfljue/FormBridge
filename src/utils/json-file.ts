export function downloadJson(items: unknown[], filenamePrefix: string): void {
  if (items.length === 0) return;

  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseJsonArray<T>(content: string): T[] {
  const value: unknown = JSON.parse(content);
  if (!Array.isArray(value)) throw new Error('Invalid JSON array');
  return value as T[];
}
