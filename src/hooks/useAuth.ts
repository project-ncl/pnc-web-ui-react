import { useAuth as useOidcAuth } from 'react-oidc-context';

export const useAuth = () => {
  const auth = useOidcAuth();

  const getRolesFromToken = (token: string | undefined): string[] => {
    if (!token) {
      return [];
    }

    const base64Payload = token.split('.')[1]; // JWT is: [header].[payload].[signature]
    const payload = JSON.parse(window.atob(base64Payload));
    return payload?.realm_access?.roles || [];
  };

  const hasRealmRole = (role: string): boolean => {
    const roles = getRolesFromToken(auth.user?.access_token);
    return roles.includes(role);
  };

  const getUser = (): string | null => {
    return auth.user?.profile?.preferred_username || auth.user?.profile?.name || null;
  };

  const getErrorMessage = (): string | null => {
    return auth.error?.message || null;
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isError: !!auth.error,
    user: getUser(),
    error: getErrorMessage(),
    hasRealmRole,
    login: () => auth.signinRedirect(),
    logout: () => auth.signoutRedirect(),
  };
};
