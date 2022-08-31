import { render } from '@testing-library/react';

import { AboutModalPage } from 'components/AboutModalPage/AboutModalPage';

test('renders AdministrationPage', () => {
  render(<AboutModalPage isOpen={true} />);
});
