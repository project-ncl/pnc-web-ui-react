export interface IAuthBroadcastMessage {
  authenticated: boolean;
}

class AuthBroadcastService {
  private channel = new BroadcastChannel('auth');

  getChannel() {
    return this.channel;
  }

  send(authenticated: boolean) {
    if (this.channel) {
      const message: IAuthBroadcastMessage = { authenticated: authenticated };
      this.channel.postMessage(message);
    }
  }
}

export const authBroadcastService = new AuthBroadcastService();
