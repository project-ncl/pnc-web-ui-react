export const getArtifacts = () => {
  return new Promise((resolve) => {
    import('./artifacts-mock.json').then((mockArtifactsRequest) => {
      resolve({ data: mockArtifactsRequest });
    });
  });
};
