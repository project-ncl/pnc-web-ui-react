import { AUTH_ROLE } from '../../services/__mocks__/keycloakService';
import { ProtectedContent, PROTECTED_TYPE } from './ProtectedContent';

interface IProtectedRouteProps {
  role?: AUTH_ROLE;
  title: string;
}

export const ProtectedRoute = ({ children, role = AUTH_ROLE.User, title }: React.PropsWithChildren<IProtectedRouteProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Route} role={role} title={title}>
    {children}
  </ProtectedContent>
);
