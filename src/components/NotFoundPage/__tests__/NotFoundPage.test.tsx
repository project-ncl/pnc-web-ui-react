import { NotFoundPage } from '../NotFoundPage';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

test('renders NotFoundPage', () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );
});
