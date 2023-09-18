import { AUTH_ROLE } from 'services/keycloakService';

import { PROTECTED_TYPE, ProtectedContent } from './ProtectedContent';

interface IProtectedComponentProps {
  role?: AUTH_ROLE;

  // hide component, otherwise disabled component is visible
  hide?: boolean;
}

/**
 * Protected component content is automatically disabled when some of the requirements (for example role) are not fulfilled.
 */
export const ProtectedComponent = ({
  children,
  role = AUTH_ROLE.User,
  hide = false,
}: React.PropsWithChildren<IProtectedComponentProps>) => {
  const type = hide ? PROTECTED_TYPE.ComponentHidden : PROTECTED_TYPE.ComponentDisabled;

  return (
    <ProtectedContent type={type} role={role}>
      {children}
    </ProtectedContent>
  );
};
