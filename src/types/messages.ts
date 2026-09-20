import { type DataRecord, type CookieSnapshot } from './models';

// Popup/BG -> Content Script
export interface GetStoragePayload {
  tabId: number;
}

export interface GetStorageResponse {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

export interface SetStoragePayload {
  tabId: number;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

export interface AutoFillPayload {
  tabId: number;
  record: DataRecord;
}

export interface AutoFillResponse {
  filled: number;
  failed: number;
  failedFields: string[];
  selectorMissed: string[];
  /** Fields whose selector is empty or syntactically invalid; they were skipped, not name-matched. */
  invalidSelectors: string[];
  /** True when the record's button selector is empty or invalid, so no click was attempted. */
  buttonInvalid: boolean;
  clicked: boolean;
}

/** Auto-fill result returned by the service worker to the popup. */
export interface AutoFillResult extends AutoFillResponse {
  total: number;
  success: boolean;
  message: string;
}

// Content Script -> Background -> Popup
export interface CopyCookiesPayload {
  tabId: number;
}

export interface PasteCookiesPayload {
  tabId: number;
}

export interface CookieOpResult {
  success: number;
  failed: number;
  message: string;
}

export interface ClearCookiesPayload {
  tabId: number;
}

export interface ClearCookiesResponse {
  success: boolean;
  removed: number;
  failed: number;
  message: string;
}

export type ExtensionMessage =
  | { action: 'GET_PAGE_STORAGE' }
  | { action: 'SET_PAGE_STORAGE'; payload: SetStoragePayload }
  | { action: 'COPY_COOKIES'; payload?: CopyCookiesPayload }
  | { action: 'PASTE_COOKIES'; payload?: PasteCookiesPayload }
  | { action: 'CLEAR_COOKIES'; payload?: ClearCookiesPayload }
  | { action: 'AUTO_FILL_FORM'; payload: AutoFillPayload };
