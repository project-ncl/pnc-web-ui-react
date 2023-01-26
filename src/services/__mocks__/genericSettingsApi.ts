export const getAnnouncementBanner = () => {
  return new Promise((resolve) => {
    import('./announcement-mock.json').then((mockProjectsRequest) => {
      resolve({ data: mockProjectsRequest });
    });
  });
};

export const getPncVersion = () => {
  return new Promise((resolve) => {
    resolve({ data: 'test' });
  });
};
