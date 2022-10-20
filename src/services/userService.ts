import { AxiosRequestConfig } from 'axios';

import { User } from 'pnc-api-types-ts';

import { pncClient } from 'services/pncClient';

/**
 * Class managing information about user.
 */
class UserService {
  // null means user information is not available
  private user: User | null = null;

  public removeUser() {
    this.user = null;
  }

  public fetchUser() {
    return this.getCurrentUser()
      .then((response: any) => {
        this.user = response.data;
      })
      .catch((error: any) => {
        this.user = null;
      });
  }

  public getUserId() {
    return this.user?.id || null;
  }

  private getCurrentUser(requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get('/users/current', requestConfig);
  }
}

/**
 * Instance of userService providing group of User related API operations.
 */
export const userService = new UserService();
