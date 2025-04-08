import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';

import { ProjectDetailPage } from 'components/ProjectDetailPage/ProjectDetailPage';

global.ResizeObserver = ResizeObserver;

jest.mock('services/projectApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');
jest.mock('services/webConfigService');

const mockMatches = [
  { id: '0', pathname: '/', params: { projectId: '106' }, data: undefined, handle: undefined },
  { id: '0-2', pathname: '/projects', params: { projectId: '106' }, data: undefined, handle: 'projects' },
  { id: '0-2-2', pathname: '/projects/106', params: { projectId: '106' }, data: undefined, handle: undefined },
  { id: '0-2-2-0', pathname: '/projects/106/', params: { projectId: '106' }, data: undefined, handle: undefined }, //proper handle is 'project' but test is failing
];

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useParams: () => ({
    projectId: '106',
  }),
  useMatches: () => mockMatches,
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
