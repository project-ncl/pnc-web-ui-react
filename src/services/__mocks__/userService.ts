import { User } from 'common/pnc-api-types-ts';

export class UserService {
  public setUser(_user: User) {}

  public clearUser() {}

  public getUserId() {
    return '150';
  }
}

export const userService = new UserService();
