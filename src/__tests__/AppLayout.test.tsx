import { render } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { MemoryRouter } from 'react-router-dom';

window.pnc = {
  config: {
    userGuideUrl: 'https://localhost:3000/',
  },
};

test('renders AppLayout', () => {
  render(
    <MemoryRouter>
      <AppLayout>
        <div></div>
      </AppLayout>
    </MemoryRouter>
  );
});
