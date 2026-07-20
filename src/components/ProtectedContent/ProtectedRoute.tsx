import { PropsWithChildren } from 'react';

import { useProtectedContent } from 'hooks/useProtectedContent';

import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { KeycloakStatusPage } from 'components/KeycloakStatusPage/KeycloakStatusPage';

import { AUTH_ROLE, keycloakService } from 'services/keycloakService';

interface IProtectedRouteProps extends PropsWithChildren {
  role?: AUTH_ROLE;

  // Page name that will be used when constructing error page title
  title: string;
}

/**
 * Error page is displayed when some of the requirements (for example role) are not fulfilled.
 */
export const ProtectedRoute = ({ children, role = AUTH_ROLE.User, title }: IProtectedRouteProps) => {
  const { reason, state } = useProtectedContent({ role });

  if (state === 'KEYCLOAK_UNAVAILABLE') {
    return <KeycloakStatusPage errorPageTitle={title} />;
  }

  if (state === 'NOT_AUTHENTICATED') {
    keycloakService.login().catch(() => {
      throw new Error('Keycloak login failed.');
    });
    return <div>Redirecting to keycloak...</div>;
  }

  if (state === 'ROLE_NOT_ALLOWED') {
    return <ErrorPage pageTitle={title} errorDescription={reason} />;
  }

  return <>{children}</>;
};
