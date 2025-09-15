import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { ActionButton } from 'components/ActionButton/ActionButton';

vi.mock('components/ProtectedContent/ProtectedComponent');

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
