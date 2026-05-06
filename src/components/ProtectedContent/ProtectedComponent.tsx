import { ReactNode } from 'react';
import { Link } from 'react-router';

import { useProtectedContent } from 'hooks/useProtectedContent';

import { AUTH_ROLE } from 'services/keycloakService';

interface IComponentWithProtectionProps {
  role?: AUTH_ROLE;
}

/**
 * Higher-order component that wraps a component with protection logic.
 * Protected component content is automatically disabled when some of the requirements (for example role) are not fulfilled.
 *
 * Tooltip passed in WrappedComponent will be protection reason if defined, otherwise component's tooltip prop.
 *
 * `Protected` prefix should be used on the component names created with this function. See {@link Button} for example.
 *
 * @template ComponentProps - The props of the wrapped component, which must include `isDisabled` and the tooltip prop.
 * @param WrappedComponent - The component to be wrapped with protection logic.
 * @param tooltipProp - The name of the tooltip prop on the WrappedComponent to display the protection reason.
 * @returns A new component that enforces protection logic based on authentication state and role.
 */
export const withProtection = <ComponentProps extends { isDisabled?: boolean }>(
  WrappedComponent: React.ComponentType<ComponentProps>,
  tooltipProp: ReactNode & keyof ComponentProps
) => {
  return ({ role, isDisabled, ...props }: ComponentProps & IComponentWithProtectionProps) => {
    const { isDisabled: isDisabledByProtection, reason, state } = useProtectedContent({ role });

    const modifiedReason =
      state === 'KEYCLOAK_UNAVAILABLE' ? (
        <>
          {reason} See <Link to="/system/keycloak-status">Keycloak status page</Link>
        </>
      ) : (
        reason
      );

    return (
      <WrappedComponent
        {...(props as ComponentProps)}
        isDisabled={isDisabledByProtection || isDisabled}
        {...{ [tooltipProp]: modifiedReason || (props as ComponentProps)[tooltipProp] }}
      />
    );
  };
};
