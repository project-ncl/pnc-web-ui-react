import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { DashboardPage } from 'components/DashboardPage/DashboardPage';

vi.mock('services/webConfigService');
vi.mock('services/keycloakService');
vi.mock('services/userService');
vi.mock('services/buildApi');
vi.mock('contexts/ThemeContext');

test('renders DashboardPage', () => {
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
});
