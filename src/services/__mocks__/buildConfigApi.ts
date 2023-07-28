/**
 * Gets all BuildConfigs with latest build.
 *
 */
export const getBuildConfigsWithLatestBuild = () => {
  return new Promise((resolve) => {
    import('./build-configs-mock.json').then((mockBuildsRequest) => {
      resolve({ data: mockBuildsRequest });
    });
  });
};
