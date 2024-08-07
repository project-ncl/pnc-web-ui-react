import { User } from 'pnc-api-types-ts';

import { AUTH_ROLE, keycloakService } from 'services/keycloakService';
import * as userApi from 'services/userApi';

/**
 * Class managing information about user.
 */
class UserService {
  private user: User = { id: 'anonymous' };

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

  public isAdminUser() {
    return keycloakService.hasRealmRole(AUTH_ROLE.Admin);
  }

  public getUserId() {
    return this.user.id;
  }
}

/**
 * Instance of UserService providing group of User related operations.
 */
export const userService = new UserService();
