import { render } from '@testing-library/react';

import { DashboardPage } from '../DashboardPage';

jest.mock('../../../services/WebConfigService');

test('renders DashboardPage', () => {
  render(<DashboardPage />);
});
