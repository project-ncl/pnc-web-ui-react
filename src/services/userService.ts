import { User } from 'pnc-api-types-ts';

import * as userApi from 'services/userApi';

const anonUser = { id: 'anonymous' };

/**
 * Class managing information about user.
 */
class UserService {
  private user: User = anonUser;

  public fetchUser() {
    return userApi
      .getCurrentUser()
      .then((response) => {
        this.user = response.data;
      })
      .catch(() => {
        this.user = { id: 'error' };
        console.error('User Manager: Could not fetch current user.');
      });
  }

  public clearUser() {
    this.user = anonUser;
  }

  public getUserId() {
    return this.user.id;
  }
}

/**
 * Instance of UserService providing group of User related operations.
 */
export const userService = new UserService();
