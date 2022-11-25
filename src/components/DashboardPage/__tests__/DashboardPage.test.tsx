import { render } from '@testing-library/react';

import { DashboardPage } from 'components/DashboardPage/DashboardPage';

jest.mock('services/webConfigService');

test('renders DashboardPage', () => {
  render(<DashboardPage />);
});
