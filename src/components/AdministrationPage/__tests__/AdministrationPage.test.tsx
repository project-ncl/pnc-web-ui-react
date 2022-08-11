import { render } from '@testing-library/react';

import { AdministrationPage } from '../AdministrationPage';

jest.mock('../../../services/buildService');

test('renders AdministrationPage', () => {
  render(<AdministrationPage />);
});
