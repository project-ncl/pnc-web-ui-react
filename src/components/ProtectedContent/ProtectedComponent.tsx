import { AUTH_ROLE } from 'services/keycloakService';

import { PROTECTED_TYPE, ProtectedContent } from './ProtectedContent';

interface IProtectedComponentProps {
  role?: AUTH_ROLE;
  hide?: boolean;
  disable?: boolean;
}

export const ProtectedComponent = ({
  children,
  role = AUTH_ROLE.User,
  hide = false,
  disable = false,
}: React.PropsWithChildren<IProtectedComponentProps>) => (
  <ProtectedContent type={PROTECTED_TYPE.Component} role={role} hide={hide} disable={disable}>
    {children}
  </ProtectedContent>
);
