import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from 'hooks/useAuth';
import { useProtectedContent } from 'hooks/useProtectedContent';
import { StorageKeys } from 'hooks/useStorage';

import { AuthServiceStatusPage } from 'components/AuthServiceStatusPage/AuthServiceStatusPage';

import { ANONYMOUS_ACCESS } from 'utils/features';

/**
 * Redirects unauthenticated users to the Auth Service (when anonymous access is not allowed).
 *
 * Individual pages are protected with {@link ProtectedRoute}.
 */
export const AuthGate = () => {
  const authLogin = useAuth().login;
  const location = useLocation();
  const { state } = useProtectedContent({});

  // location is stored to restore query parameters
  const [locationBeforeLogin, setLocationBeforeLogin] = useState<string | null>(() =>
    sessionStorage.getItem(StorageKeys.locationBeforeLogin)
  );

  const isLoginRequired = !ANONYMOUS_ACCESS.isEnabled && state === 'NOT_AUTHENTICATED';
  const requestedLocation = `${location.pathname}${location.search}${location.hash}`;
  const restoredLocation =
    state === 'ALLOWED' && locationBeforeLogin?.startsWith(location.pathname) && locationBeforeLogin !== requestedLocation
      ? locationBeforeLogin
      : null;

  useEffect(() => {
    if (isLoginRequired) {
      sessionStorage.setItem(StorageKeys.locationBeforeLogin, requestedLocation);
      authLogin();
    } else if (state === 'ALLOWED' && locationBeforeLogin) {
      sessionStorage.removeItem(StorageKeys.locationBeforeLogin);
      setLocationBeforeLogin(null);
    }
  }, [isLoginRequired, state, locationBeforeLogin, requestedLocation, authLogin]);

  if (ANONYMOUS_ACCESS.isEnabled) {
    return <Outlet />;
  }

  if (state === 'ERROR') {
    return <AuthServiceStatusPage />;
  }

  if (state === 'NOT_AUTHENTICATED') {
    return <div>Redirecting to Auth Service...</div>;
  }

  return restoredLocation ? <Navigate to={restoredLocation} replace /> : <Outlet />;
};
