export const getScmRepository = (id: string) => {
  return new Promise((resolve) => {
    import('./scmRepository-mock.json').then((mockScmRepositoryRequest) => {
      resolve({ data: mockScmRepositoryRequest });
    });
  });
};
