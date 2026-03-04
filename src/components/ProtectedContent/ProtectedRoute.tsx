import { PropsWithChildren } from 'react';

import { useAuth } from 'hooks/useAuth';
import { useProtectedContent } from 'hooks/useProtectedContent';

import { AuthServiceStatusPage } from 'components/AuthServiceStatusPage/AuthServiceStatusPage';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';

import { AUTH_ROLE } from 'services/authService';

interface IProtectedRouteProps extends PropsWithChildren {
  role?: AUTH_ROLE;

  // Page name that will be used when constructing error page title
  title: string;
}

/**
 * Error page is displayed when some of the requirements (for example role) are not fulfilled.
 */
export const ProtectedRoute = ({ children, role = AUTH_ROLE.User, title }: IProtectedRouteProps) => {
  const auth = useAuth();
  const { reason, state } = useProtectedContent({ role });

  if (state === 'ERROR') {
    return <AuthServiceStatusPage errorPageTitle={title} />;
  }

  if (state === 'NOT_AUTHENTICATED') {
    auth.login().catch(() => {
      throw new Error('Auth Service login failed.');
    });
    return <div>Redirecting to Auth Service...</div>;
  }

  if (state === 'ROLE_NOT_ALLOWED') {
    return <ErrorPage pageTitle={title} errorDescription={reason} />;
  }

  return <>{children}</>;
};
