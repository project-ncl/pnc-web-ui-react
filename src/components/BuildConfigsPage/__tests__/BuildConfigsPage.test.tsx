import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';

import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';

global.ResizeObserver = ResizeObserver;

jest.mock('services/buildConfigApi');
jest.mock('services/keycloakService');
jest.mock('services/webConfigService');

test('renders BuildConfigsPage', () => {
  render(
    <MemoryRouter>
      <BuildConfigsPage />
    </MemoryRouter>
  );
});
