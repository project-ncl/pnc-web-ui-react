import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { BuildsPage } from 'components/BuildsPage/BuildsPage';

global.ResizeObserver = ResizeObserver;

vi.mock('services/buildApi');
vi.mock('services/keycloakService');
vi.mock('services/uiLogger');
vi.mock('services/webConfigService');

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
    render(<MemoryRouter>{<BuildsPage />}</MemoryRouter>);
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
    await waitFor(() => {
      expect(tree.container).toMatchSnapshot();
    });
  });
});
