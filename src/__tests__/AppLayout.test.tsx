import { render } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { MemoryRouter } from 'react-router-dom';

test('renders AppLayout', () => {
  render(
    <MemoryRouter>
      <AppLayout>
        <div></div>
      </AppLayout>
    </MemoryRouter>
  );
});
