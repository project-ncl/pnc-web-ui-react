import { act } from '@testing-library/react';
import { ProjectsPage } from '../ProjectsPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../services/projectService');

describe('display ProjectsPage component', () => {
  let projectsMock: any;

  async function loadMocks() {
    const projectsRequestMock = await import('../../../services/__mocks__/projects-mock.json');
    projectsMock = projectsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ProjectsPage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );
    });
    const firstProject = screen.getByText(projectsMock[0].name);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(projectsMock[6].description);
    expect(lastProject).toBeInTheDocument();
    const lastProjectCount = screen.getByText(17);
    expect(lastProjectCount).toBeInTheDocument();
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
