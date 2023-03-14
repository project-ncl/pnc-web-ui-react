import { act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoriesPage } from 'components/ScmRepositoriesPage/ScmRepositoriesPage';

jest.mock('services/scmRepositoryApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

describe('display ScmRepositoriesPage component', () => {
  let scmRepositoriesMock: any;

  async function loadMocks() {
    const scmRepositoriesRequestMock = await import('services/__mocks__/scmRepositories-mock.json');
    scmRepositoriesMock = scmRepositoriesRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ScmRepositoriesPage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ScmRepositoriesPage />
        </MemoryRouter>
      );
    });
    const firstProject = screen.getByText(scmRepositoriesMock[0].internalUrl);
    expect(firstProject).toBeInTheDocument();
    const lastProject = screen.getByText(scmRepositoriesMock[1].externalUrl);
    expect(lastProject).toBeInTheDocument();
  });
});
