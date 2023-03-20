import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-test-renderer';

import { BuildsPage } from 'components/BuildsPage/BuildsPage';

jest.mock('services/buildApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

describe('display BuildsPage component', () => {
  let buildsMock: any;

  async function loadMocks() {
    const buildsRequestMock = await import('services/__mocks__/builds-mock.json');
    buildsMock = buildsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders BuildsPage', () => {
    render(
      <MemoryRouter>
        <BuildsPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <BuildsPage />
        </MemoryRouter>
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
