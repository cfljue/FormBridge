export function sendToBackground<T = unknown>(message: unknown): Promise<T | null> {
  return chrome.runtime.sendMessage(message) as Promise<T | null>;
}

export function onMessage(
  handler: (message: unknown, sender: chrome.runtime.MessageSender) => Promise<unknown> | unknown
): () => void {
  const listener = (
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    const result = handler(message, sender);
    if (result instanceof Promise) {
      result.then(sendResponse).catch(() => sendResponse(null));
      return true;
    }
    sendResponse(result);
  };
  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
}
