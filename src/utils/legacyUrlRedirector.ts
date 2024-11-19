import { URL_BASE_PATH } from 'common/constants';

export const legacyUrlRedirector = () => {
  console.log('legacyUrlRedirector init');
  const { pathname, hash } = window.location;

  if (pathname.startsWith(URL_BASE_PATH + '/') && hash.startsWith('#/')) {
    let newPath = '/' + hash.substring(2); // Remove '#/' and concatenate

    console.log(
      `You are accessing a legacy PNC URL: ${window.location}. Please save the new URL after redirection for a better experience.`
    );

    // Remove the query string part
    const queryIndex = newPath.indexOf('?');
    if (queryIndex !== -1) {
      const removedQueryString = newPath.substring(queryIndex);
      console.log(`Query string removed from old URL: ${removedQueryString}`);
      newPath = newPath.substring(0, queryIndex);
    }

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

  console.log('G1: legacyUrlRedirector done');
};
