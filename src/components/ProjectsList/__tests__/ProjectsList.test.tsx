import { ProjectsList } from '../ProjectsList';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

test('renders ProjectsList', () => {
  render(
    <MemoryRouter>
      <ProjectsList />
    </MemoryRouter>
  );
});
