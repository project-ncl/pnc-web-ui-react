import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoriesPage } from 'components/ScmRepositoriesPage/ScmRepositoriesPage';

test('renders ScmRepositoriesPage', () => {
  render(
    <MemoryRouter>
      <ScmRepositoriesPage />
    </MemoryRouter>
  );
});
