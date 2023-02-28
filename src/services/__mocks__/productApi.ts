export const getProducts = () => {
  return new Promise((resolve) => {
    import('./products-mock.json').then((mockProductsRequest) => {
      resolve({ data: mockProductsRequest });
    });
  });
};
