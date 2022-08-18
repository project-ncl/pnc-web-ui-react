import { AUTH_ROLE } from '../../services/keycloakService';
import { ProtectedContent, PROTECTED_TYPE } from './ProtectedContent';

interface IProtectedComponentProps {
  role?: AUTH_ROLE;
  hideOnError?: boolean;
}

export const ProtectedComponent = ({
  children,
  role = AUTH_ROLE.User,
  hideOnError = false,
}: React.PropsWithChildren<IProtectedComponentProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Component} role={role} hideOnError={hideOnError}>
    {children}
  </ProtectedContent>
);
