import buildConfigsWithLatestBuildMock from './build-configs-with-latest-build-mock.json';
import scmRepositoriesMock from './scm-repositories-mock.json';
import scmRepositoryMock from './scm-repository-mock.json';

export const getScmRepository = (id: string) => {
  return Promise.resolve({ data: scmRepositoryMock });
};

export const getScmRepositories = () => {
  return Promise.resolve({ data: scmRepositoriesMock });
};

export const getBuildConfigsWithLatestBuild = () => {
  return Promise.resolve({ data: buildConfigsWithLatestBuildMock });
};
