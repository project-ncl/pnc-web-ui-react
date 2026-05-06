import { useProtectedContent } from 'hooks/useProtectedContent';

import { AUTH_ROLE } from 'services/keycloakService';

const HiddenContent = () => null;

interface IProtectedComponentProps {
  role?: AUTH_ROLE;
}

/**
 * Restricted content is automatically hidden when some of the requirements (for example role) are not fulfilled.
 *
 * @param children - content to be restricted
 * @param role - minimum required role to see the content
 */
export const RestrictedContent = ({ children, role = AUTH_ROLE.User }: React.PropsWithChildren<IProtectedComponentProps>) => {
  const { isDisabled } = useProtectedContent({ role });

  if (isDisabled) {
    return <HiddenContent />;
  }

  return <>{children}</>;
};
