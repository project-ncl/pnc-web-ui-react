interface IAuthBroadcastMessage {
  authenticated: boolean;
  user: string | null;
}

const broadcastChannel = {
  postMessage: (message: IAuthBroadcastMessage) => console.log('Message sent'),
};

const broadcastServiceMock = (channelName: string) => {
  return {
    send(authenticated: boolean, user: string | null) {
      broadcastChannel.postMessage({ authenticated, user });
    },

    addMessageListener(onMessageListener: any) {
      console.log('Listener added');
      return () => {
        console.log('Listener removed');
      };
    },

    close() {
      console.log('Broadcast service closed');
    },
  };
};

export const authBroadcastService = broadcastServiceMock('test');
