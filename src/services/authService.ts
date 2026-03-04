import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AuthProviderProps } from 'react-oidc-context';

import { URL_BASE_PATH } from 'common/constants';

import { userService } from 'services/userService';
import { getAuthConfigAuthority, getAuthConfigClientId } from 'services/webConfigService';

const currentUrl = window.location.origin + URL_BASE_PATH;

const authConfig: AuthProviderProps = {
  authority: getAuthConfigAuthority(),
  client_id: getAuthConfigClientId(),
  redirect_uri: currentUrl,
  post_logout_redirect_uri: currentUrl,
  silent_redirect_uri: currentUrl,
  automaticSilentRenew: true,
  response_type: 'code',
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(authConfig);

userManager.events.addUserLoaded(() => {
  userService.fetchUser();
});

userManager.events.addUserSignedIn(() => {
  userManager.signinSilent();
});

userManager.events.addUserUnloaded(() => {
  userService.clearUser();
});

userManager.events.addUserSignedOut(() => {
  userManager.removeUser();
});

userManager.events.addSilentRenewError(() => {
  userManager.removeUser();
  userManager.signinRedirect();
});

userManager.events.addAccessTokenExpired(() => {
  userManager.removeUser();
  userManager.signinRedirect();
});

userManager.getUser().then((user) => {
  if (user && !user.expired) {
    userService.fetchUser();
  }
});

export enum AUTH_ROLE {
  Admin = import.meta.env.VITE_ADMIN_ROLE,
  User = import.meta.env.VITE_USER_ROLE,
}

export const authService = {
  async getToken(): Promise<string | null> {
    const user = await userManager.getUser();
    if (!user || user.expired) {
      return null;
    }

    return user.access_token;
  },
};
