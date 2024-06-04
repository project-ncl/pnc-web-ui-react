/**
 * Gets all BuildConfigs.
 */
export const getBuildConfigs = () => {
  return new Promise((resolve) => {
    import('./build-configs-mock.json').then((mockBuildsRequest) => {
      resolve({ data: mockBuildsRequest });
    });
  });
};

/**
 * Gets all BuildConfigs with latest build.
 *
 */
export const getBuildConfigsWithLatestBuild = () => {
  return new Promise((resolve) => {
    import('./build-configs-with-latest-build-mock.json').then((mockBuildsRequest) => {
      resolve({ data: mockBuildsRequest });
    });
  });
};
