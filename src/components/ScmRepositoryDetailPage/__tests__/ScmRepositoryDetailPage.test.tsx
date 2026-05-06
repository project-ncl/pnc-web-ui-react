import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { ScmRepositoryDetailPage } from 'components/ScmRepositoryDetailPage/ScmRepositoryDetailPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/scmRepositoryApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

const mockMatches = [
  { id: '0', pathname: '/', params: { scmRepositoryId: '111' }, data: undefined, handle: undefined },
  { id: '0-8', pathname: '/scm-repositories', params: { scmRepositoryId: '111' }, data: undefined, handle: 'scmRepositories' },
  {
    id: '0-8-3',
    pathname: '/scm-repositories/111',
    params: { scmRepositoryId: '111' },
    data: undefined,
    handle: undefined, //scmRepository but test is failing
  },
];

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    __esModule: true,
    ...actual,
    useParams: () => ({ scmRepositoryId: '111' }),
    useMatches: () => mockMatches,
  };
});

describe('display ScmRepositoryDetailPage component', () => {
  let scmRepositoryMock: any;

  async function loadMocks() {
    const scmRepositoryRequestMock = await import('services/__mocks__/scm-repository-mock.json');
    scmRepositoryMock = scmRepositoryRequestMock;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ScmRepositoryDetail', () => {
    render(
      <MemoryRouter>
        <ScmRepositoryDetailPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', () => {
    const tree = render(
      <MemoryRouter>
        <ScmRepositoryDetailPage />
      </MemoryRouter>
    );
    expect(tree.container).toMatchSnapshot();
  });

  test('renders ScmRepositoryDetail to have the right data', async () => {
    render(
      <MemoryRouter>
        <ScmRepositoryDetailPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      const displayName = screen.getByText(scmRepositoryMock.displayName);
      expect(displayName).toBeInTheDocument();
    });
  });
});
