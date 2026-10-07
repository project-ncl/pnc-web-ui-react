import buildCountMock from './build-count-mock.json';
import buildsMock from './builds-mock.json';

export const getBuilds = () => {
  return Promise.resolve({ data: buildsMock });
};

export const getUserBuilds = () => {
  return Promise.resolve({ data: buildsMock });
};

export const getBuildMetrics = (buildIds?: Array<string>) => {
  throw new Error('getBuildMetrics: Not implemented yet');
};

export const getBuildCount = () => {
  return Promise.resolve({ data: buildCountMock });
};
