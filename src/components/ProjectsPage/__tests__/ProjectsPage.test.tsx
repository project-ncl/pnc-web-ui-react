import { render } from '@testing-library/react';
import { ProjectsPage } from '../ProjectsPage';
import { MemoryRouter } from 'react-router-dom';

test('renders ProjectsPage', () => {
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>
  );
});
