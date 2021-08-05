import { render } from '@testing-library/react';
import { AboutModalPage } from '../AboutModalPage';

test('renders AdministrationPage', () => {
  render(<AboutModalPage isOpen={true} />);
});
