import groupConfigsMock from './group-configs-mock.json';

export const getGroupConfigs = () => {
  return Promise.resolve({ data: groupConfigsMock });
};
