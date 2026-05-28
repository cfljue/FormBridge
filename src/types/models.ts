export interface TemplateField {
  id: string;
  name: string;
  selector: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  url: string;
  fields: TemplateField[];
  button?: { name: string; selector: string };
  createdAt: number;
  updatedAt: number;
}

export interface DataFieldValue {
  name: string;
  selector: string;
  value: string;
}

export interface DataRecord {
  id: string;
  name: string;
  description: string;
  url: string;
  templateId: string;
  values: DataFieldValue[];
  buttonName?: string;
  buttonSelector?: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface CookieSnapshot {
  sourceDomain: string;
  sourceUrl: string;
  cookies: chrome.cookies.Cookie[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  timestamp: number;
}

export type AppLanguage = 'en' | 'zh';

export interface AppSettings {
  cookieCopyEnabled: boolean;
  dataCardOrder: string[];
  language: AppLanguage;
  popupWidth: number;
}
