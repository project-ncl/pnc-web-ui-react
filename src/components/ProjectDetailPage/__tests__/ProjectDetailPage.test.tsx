import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ProjectDetailPage } from 'components/ProjectDetailPage/ProjectDetailPage';

jest.mock('services/projectApi');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    projectId: '106',
  }),
}));

describe('display ProjectDetailPage component', () => {
  let projectMock: any;

  async function loadMocks() {
    const projectRequestMock = await import('services/__mocks__/project-mock.json');
    projectMock = projectRequestMock;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ProjectDetail', () => {
    render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });

  test('renders ProjectDetail to have the right data', async () => {
    render(
      <MemoryRouter>
        <ProjectDetailPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      const projectName = screen.getByText(projectMock.name);
      expect(projectName).toBeInTheDocument();
      const projectDescription = screen.getByText(projectMock.description);
      expect(projectDescription).toBeInTheDocument();
    });
  });
});
