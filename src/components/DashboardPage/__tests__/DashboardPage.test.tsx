import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { DashboardPage } from 'components/DashboardPage/DashboardPage';

jest.mock('services/webConfigService');
jest.mock('services/keycloakService');
jest.mock('services/userService');
jest.mock('services/buildApi');

test('renders DashboardPage', () => {
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
});
