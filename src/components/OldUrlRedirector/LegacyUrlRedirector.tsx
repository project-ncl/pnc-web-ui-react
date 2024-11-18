import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LegacyUrlRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, hash } = window.location;

    if (pathname.startsWith('/pnc-web/') && hash.startsWith('#/')) {
      let newPath = '/' + hash.substring(2); // Remove '#/' and concatenate

      // If it contains '/build-configs/', remove everything between '/pnc-web/' and '/build-configs/'
      const buildConfigsIndex = newPath.indexOf('/build-configs/');
      if (buildConfigsIndex !== -1) {
        newPath = newPath.substring(buildConfigsIndex);
      }

      // If it contains '/builds/', remove everything between '/pnc-web/' and '/builds/'
      const buildsIndex = newPath.indexOf('/builds/');
      if (buildsIndex !== -1) {
        newPath = newPath.substring(buildsIndex);
      }

      navigate(newPath, { replace: true });
    }
  }, [navigate]);

  return null;
};
