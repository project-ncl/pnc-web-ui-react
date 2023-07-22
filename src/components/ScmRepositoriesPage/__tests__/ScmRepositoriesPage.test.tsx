import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ScmRepositoriesPage } from 'components/ScmRepositoriesPage/ScmRepositoriesPage';

jest.mock('services/scmRepositoryApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

describe('display ScmRepositoriesPage component', () => {
  let scmRepositoriesMock: any;

  async function loadMocks() {
    const scmRepositoriesRequestMock = await import('services/__mocks__/scm-repositories-mock.json');
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
    const firstScmRepository = screen.getByText(scmRepositoriesMock[0].internalUrl);
    expect(firstScmRepository).toBeInTheDocument();
    const lastScmRepository = screen.getByText(scmRepositoriesMock[1].externalUrl);
    expect(lastScmRepository).toBeInTheDocument();
  });
});
