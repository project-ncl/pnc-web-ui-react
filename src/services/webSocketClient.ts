import { uiLogger } from 'services/uiLogger';
import * as webConfigService from 'services/webConfigService';

type TWebSocketListener = (messageEvent: MessageEvent) => void;
type TRemoveMessageListener = () => void;
interface IAddMessageListenerOptions {
  // NCL-8377
  debug?: string;
}

const webSocketClient = (url: string) => {
  const webSocket: WebSocket = new WebSocket(url);
  const messageListeners: Array<TWebSocketListener> = [];
  const random = Math.random(); // debug purposes, NCL-8377
  const LISTENERS_WARNING_COUNT = 20;

  webSocket.onopen = () => {
    console.log('WebSocket open', url);
  };

  webSocket.onmessage = (message: MessageEvent) => {
    // All listeners get all messages, listeners are supposed to filter them
    messageListeners.forEach((listener) => {
      listener(message);
    });
  };

  return {
    /**
     * Add WebSocket message listener.
     *
     * @param onMessageListener - Callback function processing WebSocket message
     * @param options - see {@link IAddMessageListenerOptions}
     * @returns removeMessageListener (unsubscribe) method
     */
    addMessageListener: (
      onMessageListener: TWebSocketListener,
      { debug = '' }: IAddMessageListenerOptions = {}
    ): TRemoveMessageListener => {
      messageListeners.push(onMessageListener);

      if (messageListeners.length >= LISTENERS_WARNING_COUNT) {
        uiLogger.log(
          `webSocketClient: number of listeners is ${messageListeners.length} (warning limit: ${LISTENERS_WARNING_COUNT}), potential leaks should be investigated`
        );
      }

      if (debug) {
        console.log(`webSocketClient: add listener [${messageListeners.length}, ${random}, ${debug}]`);
      }

      return () => {
        const index = messageListeners.indexOf(onMessageListener);
        if (index >= 0) {
          messageListeners.splice(index, 1);
          if (debug) {
            console.log(`webSocketClient: rem listener [${messageListeners.length}, ${random}, ${debug}]`);
          }
        } else {
          uiLogger.log(
            `webSocketClient: trying remove already removed listener, [total listeners: #${messageListeners.length}#, random: #${random}#, debug: #${debug}#]`
          );
        }
      };
    },
  };
};

export const pncWebSocketClient = webSocketClient(webConfigService.getPncNotificationsUrl());
