export function fuzzySearch<T>(
  items: T[],
  query: string,
  keys: (keyof T & string)[]
): T[] {
  if (!query.trim()) return items;
  const lower = query.toLowerCase();
  return items.filter((item) =>
    keys.some((key) => {
      const val = item[key];
      return typeof val === 'string' && val.toLowerCase().includes(lower);
    })
  );
}
