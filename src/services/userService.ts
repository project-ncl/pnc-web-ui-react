import { User } from 'pnc-api-types-ts';

const anonUser: User = { id: 'anonymous' };

class UserService {
  private user: User = anonUser;

  public setUser(user: User) {
    this.user = user;
  }

  public clearUser() {
    this.user = anonUser;
  }

  public getUserId() {
    return this.user.id;
  }
}

export const userService = new UserService();
