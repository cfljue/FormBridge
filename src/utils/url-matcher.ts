export function urlMatches(currentUrl: string, recordUrl: string): boolean {
  if (!recordUrl) return false;
  return currentUrl.toLowerCase().includes(recordUrl.toLowerCase());
}
