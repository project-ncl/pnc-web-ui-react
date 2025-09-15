import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AdministrationPage } from 'components/AdministrationPage/AdministrationPage';

vi.mock('services/webConfigService');
vi.mock('services/buildApi');
vi.mock('services/genericSettingsApi');
vi.mock('services/githubApi');
vi.mock('services/uiLogger');

test('renders AdministrationPage', async () => {
  render(<AdministrationPage></AdministrationPage>);
  await waitFor(() => {
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });
});
