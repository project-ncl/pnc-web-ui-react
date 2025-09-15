import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { ProjectDetailPage } from 'components/ProjectDetailPage/ProjectDetailPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/projectApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

const mockMatches = [
  { id: '0', pathname: '/', params: { projectId: '106' }, data: undefined, handle: undefined },
  { id: '0-2', pathname: '/projects', params: { projectId: '106' }, data: undefined, handle: 'projects' },
  { id: '0-2-2', pathname: '/projects/106', params: { projectId: '106' }, data: undefined, handle: undefined },
  { id: '0-2-2-0', pathname: '/projects/106/', params: { projectId: '106' }, data: undefined, handle: undefined }, //proper handle is 'project' but test is failing
];

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    __esModule: true,
    ...actual,
    useParams: () => ({ projectId: '106' }),
    useMatches: () => mockMatches,
  };
});

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
    expect(tree.container).toMatchSnapshot();
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
