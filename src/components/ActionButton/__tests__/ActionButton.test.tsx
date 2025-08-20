import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { ActionButton } from 'components/ActionButton/ActionButton';

jest.mock('components/ProtectedContent/ProtectedComponent');

test('renders ActionButton', () => {
  render(
    <MemoryRouter>
      <ActionButton variant="primary" iconType={'create'} />
    </MemoryRouter>
  );
  render(
    <MemoryRouter>
      <ActionButton variant="primary" iconType={'edit'}>
        Text
      </ActionButton>
    </MemoryRouter>
  );
});
