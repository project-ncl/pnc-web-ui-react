import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ActionButton } from '../ActionButton';

test('renders all ActionButton', () => {
  render(
    <MemoryRouter>
      <ActionButton actionType={'create'} />
    </MemoryRouter>
  );
  render(
    <MemoryRouter>
      <ActionButton actionType={'edit'} />
    </MemoryRouter>
  );
  render(
    <MemoryRouter>
      <ActionButton actionType={'delete'} />
    </MemoryRouter>
  );
});
