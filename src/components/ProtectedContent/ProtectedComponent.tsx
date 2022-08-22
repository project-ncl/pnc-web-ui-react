import { AUTH_ROLE } from '../../services/keycloakService';
import { ProtectedContent, PROTECTED_TYPE } from './ProtectedContent';

interface IProtectedComponentProps {
  role?: AUTH_ROLE;
  hide?: boolean;
}

export const ProtectedComponent = ({
  children,
  role = AUTH_ROLE.User,
  hide = false,
}: React.PropsWithChildren<IProtectedComponentProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Component} role={role} hide={hide}>
    {children}
  </ProtectedContent>
);
