export const getBuilds = () => {
  return new Promise((resolve) => {
    import('./builds-mock.json').then((mockBuildsRequest) => {
      resolve({ data: mockBuildsRequest });
    });
  });
};

export const getBuildMetrics = (buildIds?: Array<string>) => {
  throw new Error('getBuildMetrics: Not implemented yet');
};

export const getBuildCount = () => {
  return new Promise((resolve) => {
    import('./build-count-mock.json').then((mockProjectRequest) => {
      resolve({ data: mockProjectRequest });
    });
  });
};
