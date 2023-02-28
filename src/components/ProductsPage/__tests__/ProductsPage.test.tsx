import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ProductsPage } from 'components/ProductsPage/ProductsPage';

jest.mock('services/productApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

test('renders ProductsPage', () => {
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );
});
