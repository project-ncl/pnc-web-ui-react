import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';

vi.mock('services/groupConfigApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

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
    expect(tree.container).toMatchSnapshot();
  });
});
