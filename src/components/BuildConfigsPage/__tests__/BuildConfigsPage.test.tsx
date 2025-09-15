import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/buildConfigApi');
vi.mock('services/keycloakService');
vi.mock('services/webConfigService');

test('renders BuildConfigsPage', () => {
  render(
    <MemoryRouter>
      <BuildConfigsPage />
    </MemoryRouter>
  );
});
