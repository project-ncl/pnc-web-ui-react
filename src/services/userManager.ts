import { User } from 'pnc-api-types-ts';

import * as userService from 'services/userService';

/**
 * Class managing information about user.
 */
class UserManager {
  // null means user information is not available
  private user: User | null = null;

  public removeUser() {
    this.user = null;
  }

  public fetchUser() {
    return userService
      .getCurrentUser()
      .then((response: any) => {
        this.user = response.data;
      })
      .catch((error: any) => {
        this.user = null;
        console.error('User Manager: Could not fetch current user.');
      });
  }

  public getUserId() {
    return this.user?.id || null;
  }
}

/**
 * Instance of userManager providing group of User related API operations.
 */
export const userManager = new UserManager();
