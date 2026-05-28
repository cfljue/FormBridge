import { describe, it, expect, beforeEach } from 'vitest';
import { mockChromeRuntime } from '../__tests__/chrome-mock';

let runtimeMock: ReturnType<typeof mockChromeRuntime>;

runtimeMock = mockChromeRuntime();

import { sendToBackground, onMessage } from './chrome-messaging';

describe('chrome-messaging service', () => {
  beforeEach(() => {
    runtimeMock.sendMessage.mockClear();
    runtimeMock.onMessage.addListener.mockClear();
    runtimeMock.onMessage.removeListener.mockClear();
  });

  describe('sendToBackground', () => {
    it('sends a message and returns response', async () => {
      runtimeMock.sendMessage.mockResolvedValueOnce({ ok: true });
      const resp = await sendToBackground({ action: 'TEST' });
      expect(resp).toEqual({ ok: true });
    });
  });

  describe('onMessage', () => {
    it('registers a listener and returns unsubscribe', () => {
      const handler = async () => 'response';
      const unsub = onMessage(handler);

      expect(runtimeMock.onMessage.addListener).toHaveBeenCalledTimes(1);
      unsub();
      expect(runtimeMock.onMessage.removeListener).toHaveBeenCalledTimes(1);
    });
  });
});
