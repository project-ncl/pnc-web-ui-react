import productsMock from './products-mock.json';

export const getProducts = () => {
  return Promise.resolve({ data: productsMock });
};
