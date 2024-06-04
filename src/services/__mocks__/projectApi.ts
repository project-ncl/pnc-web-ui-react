export const getProjects = () => {
  return new Promise((resolve) => {
    import('./projects-mock.json').then((mockProjectsRequest) => {
      resolve({ data: mockProjectsRequest });
    });
  });
};

export const getProject = (id: string) => {
  return new Promise((resolve) => {
    import('./project-mock.json').then((mockProjectRequest) => {
      resolve({ data: mockProjectRequest });
    });
  });
};

export const getProjectBuilds = (id: string) => {
  throw new Error('getProjectBuilds: Not implemented yet');
};

export const getBuildConfigsWithLatestBuild = () => {
  return new Promise((resolve) => {
    import('./build-configs-with-latest-build-mock.json').then((mockBuildConfigsRequest) => {
      resolve({ data: mockBuildConfigsRequest });
    });
  });
};
