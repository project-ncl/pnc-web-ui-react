import buildConfigsWithLatestBuildMock from './build-configs-with-latest-build-mock.json';
import projectMock from './project-mock.json';
import projectsMock from './projects-mock.json';

export const getProjects = () => {
  return Promise.resolve({ data: projectsMock });
};

export const getProject = (id: string) => {
  return Promise.resolve({ data: projectMock });
};

export const getProjectBuilds = (id: string) => {
  throw new Error('getProjectBuilds: Not implemented yet');
};

export const getBuildConfigsWithLatestBuild = () => {
  return Promise.resolve({ data: buildConfigsWithLatestBuildMock });
};
