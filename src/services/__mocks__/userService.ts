export class UserService {
  public fetchUser() {
    return import('./user-service-mock.json').then((mockUserRequest) => {}).catch(() => {});
  }
}

export const userService = new UserService();
