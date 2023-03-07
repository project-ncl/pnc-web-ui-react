export const getScmRepository = (id: string) => {
  return new Promise((resolve) => {
    import('./scmRepository-mock.json').then((mockScmRepositoryRequest) => {
      resolve({ data: mockScmRepositoryRequest });
    });
  });
};

export const getScmRepositories = () => {
  return new Promise((resolve) => {
    import('./scmRepositories-mock.json').then((mockScmRepositoriesRequest) => {
      resolve({ data: mockScmRepositoriesRequest });
    });
  });
};
