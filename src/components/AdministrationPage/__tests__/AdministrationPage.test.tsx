import { act, render, screen, waitFor } from '@testing-library/react';

import { AdministrationPage } from 'components/AdministrationPage/AdministrationPage';

jest.mock('services/buildApi');
jest.mock('services/genericSettingsApi');
jest.mock('services/githubApi');
jest.mock('services/uiLogger');

test('renders AdministrationPage', async () => {
  act(() => {
    render(<AdministrationPage></AdministrationPage>);
  });
  await waitFor(() => {
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });
});
