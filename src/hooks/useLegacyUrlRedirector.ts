import { useEffect } from 'react';

import { URL_BASE_PATH } from 'common/constants';

export const useLegacyUrlRedirector = () => {
  useEffect(() => {
    const { pathname, hash } = window.location;

    if (pathname.startsWith(URL_BASE_PATH + '/') && hash.startsWith('#/')) {
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

      console.log(`Redirecting to new URL: ${newPath}`);
      window.location.href = URL_BASE_PATH + newPath;
    }
  }, []);
};
