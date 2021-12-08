import { act } from '@testing-library/react';
import { ProjectsPage } from '../ProjectsPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

jest.mock('../../../services/projectService');

describe('display ProjectsPage component', () => {
  let mockProjectsRequest: any;
  let mockProjects: any;

  async function loadMocks() {
    mockProjectsRequest = await import('../../../services/__mocks__/projects-mock.json');
    mockProjects = mockProjectsRequest.content;
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
    const firstProject = screen.getByText(mockProjects[0].name);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(mockProjects[6].description);
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
