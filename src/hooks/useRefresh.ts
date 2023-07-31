import { useLocation, useNavigate } from 'react-router-dom';

const EMPTY_ROUTE = '/';

/**
 * Hook providing 'refresh' function to refresh page without full page reload.
 * Inspired by: https://dev.to/zbmarius/react-route-refresh-without-page-reload-1907
 */
export const useRefresh = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = () => {
    const originalRoute = location.pathname + location.search;

    navigate(EMPTY_ROUTE, { replace: true });
    setTimeout(() => {
      navigate(originalRoute, { replace: true });
    }, 0);
  };

  return refresh;
};
