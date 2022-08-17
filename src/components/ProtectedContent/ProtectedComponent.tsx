import { AUTH_ROLE } from '../../services/keycloakService';
import { ProtectedContent, PROTECTED_TYPE } from './ProtectedContent';

interface IProtectedComponentProps {
  role?: AUTH_ROLE;
}

export const ProtectedComponent = ({ children, role = AUTH_ROLE.User }: React.PropsWithChildren<IProtectedComponentProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Component} role={role}>
    {children}
  </ProtectedContent>
);
