export const getGroupConfigs = () => {
  return new Promise((resolve) => {
    import('./group-configs-mock.json').then((mockGroupConfigsRequest) => {
      resolve({ data: mockGroupConfigsRequest });
    });
  });
};
