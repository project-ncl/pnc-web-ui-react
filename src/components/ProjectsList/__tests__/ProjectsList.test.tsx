import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ProjectsList } from 'components/ProjectsList/ProjectsList';

jest.mock('services/projectService');
jest.mock('services/keycloakService');

describe('display ProjectList component', () => {
  let projectsMock: any;

  async function loadMocks() {
    const projectsRequestMock = await import('services/__mocks__/projects-mock.json');
    projectsMock = projectsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ProjectList to have the right data', () => {
    render(
      <MemoryRouter>
        <ProjectsList projects={projectsMock} />
      </MemoryRouter>
    );
    const firstProject = screen.getByText(projectsMock[0].name);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(projectsMock[6].description);
    expect(lastProject).toBeInTheDocument();
    const lastProjectCount = screen.getByText(17);
    expect(lastProjectCount).toBeInTheDocument();
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ProjectsList projects={projectsMock} />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
