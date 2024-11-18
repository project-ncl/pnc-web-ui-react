import { useEffect } from 'react';

import { URL_BASE_PATH } from 'common/constants';

import { uiLogger } from 'services/uiLogger';

export const useLegacyUrlRedirector = () => {
  useEffect(() => {
    const { pathname, hash } = window.location;
    const oldUrl = window.location;

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

      uiLogger.log(`Redirecting to new URL: ${newPath}`, undefined, { oldUrl, newUrl: newPath });
      window.history.replaceState({}, '', URL_BASE_PATH + newPath);
    }
  }, []);
};
