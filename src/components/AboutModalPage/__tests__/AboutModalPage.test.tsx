import { render } from '@testing-library/react';

import { AboutModalPage } from 'components/AboutModalPage/AboutModalPage';

jest.mock('services/genericSettingsApi');

test('renders AdministrationPage', () => {
  render(<AboutModalPage isOpen={true} />);
});
