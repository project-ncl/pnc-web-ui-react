import { useLocation, useNavigate } from 'react-router';

const EMPTY_ROUTE = '/';

// 0ms was too low because Safari optimizes there-and-back history change
// 1ms works on both Chrome and Safari
const REFRESH_DELAY_MS = 1;

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
    }, REFRESH_DELAY_MS);
  };

  return refresh;
};
