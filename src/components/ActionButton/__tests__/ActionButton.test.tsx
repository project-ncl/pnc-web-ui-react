import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ActionButton } from '../ActionButton';

test('renders ActionButton', () => {
  render(
    <MemoryRouter>
      <ActionButton iconType={'create'} />
    </MemoryRouter>
  );
  render(
    <MemoryRouter>
      <ActionButton iconType={'edit'}>Text</ActionButton>
    </MemoryRouter>
  );
});
