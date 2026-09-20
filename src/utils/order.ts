/**
 * Merges a reordered visible subset back into the full card order.
 *
 * The popup renders a filtered list (search) that is also split into matched and unmatched
 * groups, so a drag only knows about the ids currently on screen. Writing that subset straight
 * to storage dropped the custom order of every hidden record.
 */
export function mergeVisibleOrder(fullOrder: string[], visibleNewOrder: string[]): string[] {
  const ordered = [...new Set(visibleNewOrder)].filter(Boolean);
  const known = ordered.filter((id) => fullOrder.includes(id));
  if (known.length === 0) return [...fullOrder];

  // Visible slots take the new sequence; hidden ids stay where they were.
  const knownSet = new Set(known);
  let cursor = 0;
  const merged = fullOrder.map((id) => (knownSet.has(id) ? known[cursor++] : id));

  // Ids the stored order does not know about yet are appended instead of being dropped.
  return [...merged, ...ordered.filter((id) => !knownSet.has(id))];
}
