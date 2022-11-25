import { render } from '@testing-library/react';

import { AdministrationPage } from 'components/AdministrationPage/AdministrationPage';

jest.mock('services/buildApi');
jest.mock('services/genericSettingsApi');

test('renders AdministrationPage', () => {
  render(<AdministrationPage />);
});
