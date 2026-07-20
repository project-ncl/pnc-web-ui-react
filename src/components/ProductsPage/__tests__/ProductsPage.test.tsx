import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { ProductsPage } from 'components/ProductsPage/ProductsPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/productApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

test('renders ProductsPage', () => {
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );
});
