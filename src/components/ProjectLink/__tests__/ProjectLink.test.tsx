import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { ProjectLink } from 'components/ProjectLink/ProjectLink';

describe('display ProjectList component', () => {
  test('renders ProjectLink', () => {
    render(
      <MemoryRouter>
        <ProjectLink id={'555'} />
      </MemoryRouter>
    );
  });
});
