import buildConfigsMock from './build-configs-mock.json';
import buildConfigsWithLatestBuildMock from './build-configs-with-latest-build-mock.json';

/**
 * Gets all BuildConfigs.
 */
export const getBuildConfigs = () => {
  return Promise.resolve({ data: buildConfigsMock });
};

/**
 * Gets all BuildConfigs with latest build.
 *
 */
export const getBuildConfigsWithLatestBuild = () => {
  return Promise.resolve({ data: buildConfigsWithLatestBuildMock });
};
