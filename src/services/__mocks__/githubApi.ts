export const getCurrentPncWebUiCommit = () => {
  return new Promise((resolve) => {
    resolve({ data: { sha: 'ABCDEF', commit: { message: 'Test commit' } } });
  });
};
