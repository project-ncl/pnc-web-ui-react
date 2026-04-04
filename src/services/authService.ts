import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AuthProviderProps } from 'react-oidc-context';

import { userService } from 'services/userService';
import { getOidcConfigAuthority, getOidcConfigClientId } from 'services/webConfigService';

const currentUrl = window.location.origin + window.location.pathname;

const oidcConfig: AuthProviderProps = {
  authority: getOidcConfigAuthority(),
  client_id: getOidcConfigClientId(),
  redirect_uri: currentUrl,
  post_logout_redirect_uri: currentUrl,
  silent_redirect_uri: currentUrl,
  automaticSilentRenew: true,
  response_type: 'code',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

userManager.events.addUserLoaded(() => {
  userService.fetchUser();
});

userManager.getUser().then((user) => {
  if (user && !user.expired) {
    userService.fetchUser();
  }
});

export enum AUTH_ROLE {
  Admin = 'pnc-users-admin',
  User = 'Employee',
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
