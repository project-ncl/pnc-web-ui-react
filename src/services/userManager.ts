import { User } from 'pnc-api-types-ts';

import * as userApi from 'services/userApi';

/**
 * Class managing information about user.
 */
class UserManager {
  private user: User = { id: 'anonymous' };

  public fetchUser() {
    return userApi
      .getCurrentUser()
      .then((response: any) => {
        this.user = response.data;
      })
      .catch(() => {
        this.user = { id: 'error' };
        console.error('User Manager: Could not fetch current user.');
      });
  }

  public getUserId() {
    return this.user.id;
  }
}

/**
 * Instance of userManager providing group of User related API operations.
 */
export const userManager = new UserManager();
