import { AUTH_ROLE, keycloakService } from 'services/keycloakService';

interface IUseProtectedContentProps {
  role?: AUTH_ROLE;
}

/**
 * @property reason - Optional string describing why the content is disabled (e.g. not authenticated).
 * @property isDisabled - Whether the protected content should be disabled.
 * @property state - Code of the current protection state (error type or allowed).
 */
type TUseProtectedContentReturnType = {
  reason?: string;
  isDisabled: boolean;
  state: 'KEYCLOAK_UNAVAILABLE' | 'NOT_AUTHENTICATED' | 'ROLE_NOT_ALLOWED' | 'ALLOWED';
};

export const useProtectedContent = ({ role = AUTH_ROLE.User }: IUseProtectedContentProps): TUseProtectedContentReturnType => {
  if (!keycloakService.isKeycloakAvailable()) {
    return { reason: 'Keycloak service is not available.', isDisabled: true, state: 'KEYCLOAK_UNAVAILABLE' };
  }

  if (!keycloakService.isAuthenticated()) {
    return { reason: 'Login is required.', isDisabled: true, state: 'NOT_AUTHENTICATED' };
  }

  if (role !== AUTH_ROLE.User && !keycloakService.hasRealmRole(role)) {
    return {
      reason: `User not allowed to enter this page, the following permissions are required: ${role}.`,
      isDisabled: true,
      state: 'ROLE_NOT_ALLOWED',
    };
  }

  return { isDisabled: false, state: 'ALLOWED' };
};
