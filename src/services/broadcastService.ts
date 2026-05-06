import { uiLogger } from 'services/uiLogger';

export interface IAuthBroadcastMessage {
  authenticated: boolean;
  user: string | null;
}

type TBroadcastListener = (messageEvent: MessageEvent) => void;
type TRemoveMessageListener = () => void;

const broadcastService = (channelName: string) => {
  const channel = new BroadcastChannel(channelName);
  const messageListeners: Array<TBroadcastListener> = [];

  channel.onmessage = (message: MessageEvent) => {
    // All listeners get all messages
    messageListeners.forEach((listener) => {
      listener(message);
    });
  };

  return {
    /**
     * Add Broadcast listener.
     *
     * @param onMessageListener - Callback function processing broadcast message
     * @returns removeMessageListener (unsubscribe) method
     */
    addMessageListener: (onMessageListener: TBroadcastListener): TRemoveMessageListener => {
      messageListeners.push(onMessageListener);

      return () => {
        const index = messageListeners.indexOf(onMessageListener);
        if (index >= 0) {
          messageListeners.splice(index, 1);
        } else {
          uiLogger.log(
            `broadcastService: trying remove already removed listener, [total listeners: #${messageListeners.length}#]`
          );
        }
      };
    },
    /**
     * Posts new message into broadcast channel
     *
     * @param authenticated - True or false if user is authenticated
     * @param user - String with username or null
     */
    send: (authenticated: boolean, user: string | null) => {
      if (channel) {
        const message: IAuthBroadcastMessage = { authenticated: authenticated, user: user };
        channel.postMessage(message);
      } else {
        uiLogger.log("Broadcast channel for message doesn't exist");
      }
    },
    /**
     * Closes broadcast channel
     */
    close: () => {
      channel.close();
    },
  };
};

export const authBroadcastService = broadcastService('auth');
