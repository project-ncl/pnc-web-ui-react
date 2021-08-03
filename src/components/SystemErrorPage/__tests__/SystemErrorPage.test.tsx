import SystemErrorPage from '../SystemErrorPage';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

test('renders SystemErrorPage', () => {
  render(
    <MemoryRouter>
      <SystemErrorPage />
    </MemoryRouter>
  );
});
