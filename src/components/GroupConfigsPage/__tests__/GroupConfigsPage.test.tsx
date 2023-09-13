import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';

jest.mock('services/groupConfigApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

global.ResizeObserver = ResizeObserver;
describe('display GroupConfigsPage component', () => {
  let groupConfigsMock: any;

  async function loadMocks() {
    const groupConfigsRequestMock = await import('services/__mocks__/group-configs-mock.json');
    groupConfigsMock = groupConfigsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders GroupConfigsPage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GroupConfigsPage />
        </MemoryRouter>
      );
    });
    const firstGroupConfig = screen.getByText(groupConfigsMock[0].name);
    expect(firstGroupConfig).toBeInTheDocument();
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <GroupConfigsPage />
        </MemoryRouter>
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
