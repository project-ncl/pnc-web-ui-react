import { render } from '@testing-library/react';
import { ProjectLink } from '../ProjectLink';
import { MemoryRouter } from 'react-router-dom';

describe('display ProjectList component', () => {
  test('renders ProjectLink', () => {
    render(
      <MemoryRouter>
        <ProjectLink id={'555'} />
      </MemoryRouter>
    );
  });
});
