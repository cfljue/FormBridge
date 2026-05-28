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
  clicked: boolean;
}

// Popup -> Background
export interface GetActiveTabUrlResponse {
  url: string;
  domain: string;
  tabId: number;
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

export type MessageAction =
  | 'GET_PAGE_STORAGE'
  | 'SET_PAGE_STORAGE'
  | 'COPY_COOKIES'
  | 'PASTE_COOKIES'
  | 'CLEAR_COOKIES'
  | 'AUTO_FILL_FORM'
  | 'GET_ACTIVE_TAB_INFO';

export type MessagePayload =
  | GetStoragePayload
  | SetStoragePayload
  | CopyCookiesPayload
  | PasteCookiesPayload
  | ClearCookiesPayload
  | AutoFillPayload;

export interface ExtensionMessage {
  action: MessageAction;
  payload?: MessagePayload;
}
