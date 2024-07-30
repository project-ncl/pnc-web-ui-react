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
    },
  };
};

export const authBroadcastService = broadcastServiceMock('test');
