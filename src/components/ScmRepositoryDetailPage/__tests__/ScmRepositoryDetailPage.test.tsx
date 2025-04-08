import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';

import { ScmRepositoryDetailPage } from 'components/ScmRepositoryDetailPage/ScmRepositoryDetailPage';

global.ResizeObserver = ResizeObserver;

jest.mock('services/scmRepositoryApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');
jest.mock('services/webConfigService');

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

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useParams: () => ({
    scmRepositoryId: '111',
  }),
  useMatches: () => mockMatches,
}));

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
    expect(tree).toMatchSnapshot();
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
