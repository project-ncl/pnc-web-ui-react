export const getScmRepository = (id: string) => {
  return new Promise((resolve) => {
    import('./scm-repository-mock.json').then((mockScmRepositoryRequest) => {
      resolve({ data: mockScmRepositoryRequest });
    });
  });
};

export const getScmRepositories = () => {
  return new Promise((resolve) => {
    import('./scm-repositories-mock.json').then((mockScmRepositoriesRequest) => {
      resolve({ data: mockScmRepositoriesRequest });
    });
  });
};
