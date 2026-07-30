import { type ExtensionMessage, type AutoFillResponse } from '@app-types/messages';

function getAllStorage(storage: Storage): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      try { result[key] = storage.getItem(key) ?? ''; } catch { /* skip */ }
    }
  }
  return result;
}

function setAllStorage(storage: Storage, data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    try { storage.setItem(key, value); } catch { /* skip */ }
  }
}

// --- Message handler ---
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  handleContentMessage(message).then(sendResponse).catch(() => sendResponse(null));
  return true;
});

async function handleContentMessage(message: ExtensionMessage): Promise<unknown> {
  switch (message.action) {
    case 'GET_PAGE_STORAGE':
      return {
        localStorage: getAllStorage(window.localStorage),
        sessionStorage: getAllStorage(window.sessionStorage),
      };

    case 'SET_PAGE_STORAGE': {
      const p = message.payload;
      if (p.localStorage) setAllStorage(window.localStorage, p.localStorage);
      if (p.sessionStorage) setAllStorage(window.sessionStorage, p.sessionStorage);
      return { success: true };
    }

    case 'AUTO_FILL_FORM': {
      const p = message.payload;
      const record = p.record;
      const result: AutoFillResponse = { filled: 0, failed: 0, failedFields: [], selectorMissed: [], clicked: false };

      for (const f of record.values) {
        if (!f.value) continue;
        let selectorHit = true;
        let el = document.querySelector(f.selector) as HTMLElement | null;
        if (!el) {
          selectorHit = false;
          el = findInputByFieldName(f.name);
        }
        if (el) {
          setInputValue(el, f.value);
          if (selectorHit) {
            result.filled++;
          } else {
            result.selectorMissed.push(`${f.name} (${f.selector})`);
          }
        } else {
          result.failed++;
          result.failedFields.push(f.name);
        }
      }

      // Click button if configured
      if (record.buttonSelector) {
        const btn = document.querySelector(record.buttonSelector) as HTMLElement;
        if (btn) {
          btn.click();
          result.clicked = true;
        }
      }

      return result;
    }

    default:
      return null;
  }
}

function findInputByFieldName(name: string): HTMLElement | null {
  const lower = name.toLowerCase();
  // Try by name attribute
  let el = document.querySelector(`input[name="${CSS.escape(name)}"], textarea[name="${CSS.escape(name)}"], select[name="${CSS.escape(name)}"]`);
  if (el) return el as HTMLElement;
  // Try by id
  el = document.querySelector(`#${CSS.escape(name)}`);
  if (el) return el as HTMLElement;
  // Try by placeholder (partial)
  const inputs = document.querySelectorAll('input, textarea, select');
  for (const input of inputs) {
    const placeholder = (input as HTMLInputElement).placeholder?.toLowerCase() ?? '';
    const label = findLabelForInput(input as HTMLElement)?.toLowerCase() ?? '';
    const aria = (input as HTMLElement).getAttribute('aria-label')?.toLowerCase() ?? '';
    if (placeholder.includes(lower) || label.includes(lower) || aria.includes(lower)) {
      return input as HTMLElement;
    }
  }
  return null;
}

function findLabelForInput(input: HTMLElement): string | null {
  const id = input.id;
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label) return label.textContent?.trim() ?? null;
  }
  const parentLabel = input.closest('label');
  if (parentLabel) return parentLabel.textContent?.trim() ?? null;
  return null;
}

function setInputValue(el: HTMLElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype, 'value'
  )?.set;
  const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype, 'value'
  )?.set;

  const tag = el.tagName.toLowerCase();
  if (tag === 'select') {
    (el as HTMLSelectElement).value = value;
  } else if (tag === 'textarea') {
    nativeTextareaValueSetter?.call(el, value);
  } else if (tag === 'input') {
    const type = (el as HTMLInputElement).type;
    if (type === 'checkbox' || type === 'radio') {
      (el as HTMLInputElement).checked = value === 'true' || value === '1' || value.toLowerCase() === 'on';
    } else {
      nativeInputValueSetter?.call(el, value);
    }
  } else {
    (el as HTMLElement).setAttribute('value', value);
    (el as HTMLElement).innerText = value;
  }

  // Dispatch events to trigger framework reactivity
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
}
