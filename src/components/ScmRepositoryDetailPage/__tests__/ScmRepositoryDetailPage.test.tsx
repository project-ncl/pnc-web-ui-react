import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoryDetailPage } from 'components/ScmRepositoryDetailPage/ScmRepositoryDetailPage';

jest.mock('services/scmRepositoryApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    scmRepositoryId: '111',
  }),
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
