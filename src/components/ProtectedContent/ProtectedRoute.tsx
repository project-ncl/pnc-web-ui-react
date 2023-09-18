import { AUTH_ROLE } from 'services/keycloakService';

import { PROTECTED_TYPE, ProtectedContent } from './ProtectedContent';

interface IProtectedRouteProps {
  role?: AUTH_ROLE;

  // Page name that will be used when constructing error page title
  title: string;
}

/**
 * Error page is displayed when some of the requirements (for example role) are not fulfilled.
 */
export const ProtectedRoute = ({ children, role = AUTH_ROLE.User, title }: React.PropsWithChildren<IProtectedRouteProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Route} role={role} title={title}>
    {children}
  </ProtectedContent>
);
