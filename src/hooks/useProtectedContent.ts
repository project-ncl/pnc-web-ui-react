import { useAuth } from 'hooks/useAuth';

import { AUTH_ROLE } from 'services/authService';

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
  state: 'ERROR' | 'LOADING' | 'NOT_AUTHENTICATED' | 'ROLE_NOT_ALLOWED' | 'ALLOWED';
};

export const useProtectedContent = ({ role = AUTH_ROLE.User }: IUseProtectedContentProps): TUseProtectedContentReturnType => {
  const auth = useAuth();

  if (auth.isError) {
    return {
      reason: `OIDC Auth Service is currently unavailable: ${auth.error}`,
      isDisabled: true,
      state: 'ERROR',
    };
  }

  if (auth.isLoading) {
    return { reason: 'Authenticating...', isDisabled: true, state: 'LOADING' };
  }

  if (!auth.isAuthenticated) {
    return { reason: 'Login is required.', isDisabled: true, state: 'NOT_AUTHENTICATED' };
  }

  if (role !== AUTH_ROLE.User && !auth.hasRealmRole(role)) {
    return {
      reason: `User not allowed to enter this page, the following permissions are required: ${role}.`,
      isDisabled: true,
      state: 'ROLE_NOT_ALLOWED',
    };
  }

  return { isDisabled: false, state: 'ALLOWED' };
};
