import { uiLogger } from 'services/uiLogger';
import * as webConfigService from 'services/webConfigService';

type TWebSocketListener = (messageEvent: MessageEvent) => void;
type TRemoveMessageListener = () => void;
interface IAddMessageListenerOptions {
  // NCL-8377
  debug?: string;
}

export const createWebSocketClient = (url: string) => {
  const webSocket: WebSocket = new WebSocket(url);
  const messageListeners: Array<TWebSocketListener> = [];
  let messageQueue: string[] = [];
  const LISTENERS_WARNING_COUNT = 20;

  webSocket.onopen = () => {
    console.log('WebSocket open', url);

    // Send any messages that were queued while the WebSocket was not open
    messageQueue.forEach((message) => {
      webSocket.send(message);
    });
    messageQueue = []; // Clear the queue
  };

  webSocket.onmessage = (message: MessageEvent) => {
    // All listeners get all messages, listeners are supposed to filter them
    messageListeners.forEach((listener) => {
      listener(message);
    });
  };

  webSocket.onclose = (event: CloseEvent) => {
    if (event.code === 1000) {
      console.log(`WebSocket closed normally: Code ${event.code}, Reason: ${event.reason}`);
    } else {
      console.log(`WebSocket closed unexpectedly: Code ${event.code}`);
    }
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
      const random = Math.random(); // debug purposes
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

    /**
     * Send a message to the WebSocket server.
     *
     * @param message - The message to send.
     */
    sendMessage: (message: string) => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(message);
      } else if (webSocket.readyState === WebSocket.CONNECTING) {
        // Queue the message to be sent when the WebSocket is open
        messageQueue.push(message);
      } else {
        uiLogger.log('WebSocket is not open. Unable to send message: ' + message);
      }
    },

    /**
     * Close the WebSocket connection.
     */
    close: () => {
      webSocket.close(1000, 'Client closed connection');
    },
  };
};

export const pncWebSocketClient = createWebSocketClient(webConfigService.getPncNotificationsUrl());
