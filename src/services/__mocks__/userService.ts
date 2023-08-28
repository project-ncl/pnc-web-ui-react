export class UserService {
  public fetchUser() {
    return import('./user-service-mock.json').then((mockUserRequest) => {}).catch(() => {});
  }

  public getUserId() {
    return '150';
  }
}

export const userService = new UserService();
