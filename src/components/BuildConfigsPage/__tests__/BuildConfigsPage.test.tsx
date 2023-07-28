import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';

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
