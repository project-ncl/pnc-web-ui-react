import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DemoPage } from '../DemoPage';

test('renders DemoPage', () => {
  render(
    <MemoryRouter>
      <DemoPage />
    </MemoryRouter>
  );
});
