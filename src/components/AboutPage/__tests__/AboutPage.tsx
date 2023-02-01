import { render } from '@testing-library/react';

import { AboutPage } from 'components/AboutPage/AboutPage';

jest.mock('services/genericSettingsApi');

test('renders AdministrationPage', () => {
  render(<AboutPage />);
});
