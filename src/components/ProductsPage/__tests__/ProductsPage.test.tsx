import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';

import { ProductsPage } from 'components/ProductsPage/ProductsPage';

global.ResizeObserver = ResizeObserver;

jest.mock('services/productApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');
jest.mock('services/webConfigService');

test('renders ProductsPage', () => {
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );
});
