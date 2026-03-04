import { PropsWithChildren } from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';

import { userManager } from 'services/authService';

interface IAuthProviderProps extends PropsWithChildren {}

export const AuthProvider = ({ children }: IAuthProviderProps) => (
  <OidcAuthProvider
    userManager={userManager}
    onSigninCallback={(user) => {
      const callbackPath = (user?.state as { callbackPath?: string })?.callbackPath ?? '/';
      window.location.replace(callbackPath);
    }}
  >
    {children}
  </OidcAuthProvider>
);
