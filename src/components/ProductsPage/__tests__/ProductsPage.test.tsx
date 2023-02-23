import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ProductsPage } from 'components/ProductsPage/ProductsPage';

test('renders ProductsPage', () => {
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );
});
