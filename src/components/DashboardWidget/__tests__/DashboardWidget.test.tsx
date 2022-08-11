import { render, screen } from '@testing-library/react';

import { DashboardWidget } from '../DashboardWidget';

test('renders Dashboard Widget', () => {
  render(<DashboardWidget title="TEST TITLE" src="https://localhost/" />);
  expect(screen.getByText('TEST TITLE')).toBeInTheDocument();
});
