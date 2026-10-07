import { AuthContext } from 'contexts/AuthContext';
import { useCallback, useContext } from 'react';

import * as webConfigService from 'services/webConfigService';

export enum AUTH_ROLE {
  Admin = import.meta.env.VITE_ADMIN_ROLE,
  User = import.meta.env.VITE_USER_ROLE,
}

export const useAuth = () => {
  const auth = useContext(AuthContext);

  const hasRealmRole = (role: AUTH_ROLE | string): boolean => {
    return auth.user?.roles?.includes(role as string) ?? false;
  };

  const getUserDisplayName = (): string | null => {
    return auth.user?.username ?? auth.user?.id ?? null;
  };

  const login = useCallback((): Promise<void> => {
    window.location.assign(buildLoginUrl(buildRedirectPath()));
    return Promise.resolve();
  }, []);

  const logout = useCallback((): Promise<void> => {
    window.location.assign(buildLogoutUrl(buildRedirectPath()));
    return Promise.resolve();
  }, []);

  return {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    isError: auth.isError,
    user: getUserDisplayName(),
    error: auth.error,
    hasRealmRole,
    login,
    logout,
  };
};

const buildLoginUrl = (redirectPath: string): string => {
  return `${webConfigService.getPncUrl()}/users/login/${redirectPath}`;
};

const buildLogoutUrl = (redirectPath: string): string => {
  return `${webConfigService.getPncUrl()}/users/logout/${redirectPath}`;
};

const buildRedirectPath = (): string => {
  const scheme = window.location.protocol.replace(':', '');
  const host = window.location.host;
  const path = `${window.location.pathname}`;
  return `${scheme}/${host}${path}`;
};
