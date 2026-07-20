import { act, render } from '@testing-library/react';
import * as routeData from 'react-router';
import { MemoryRouter } from 'react-router';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

import { AppLayout } from '../AppLayout';

global.ResizeObserver = ResizeObserver;

vi.mock('services/keycloakService');
vi.mock('services/genericSettingsApi');
vi.mock('services/webConfigService');
vi.mock('services/broadcastService');
vi.mock('contexts/ThemeContext');

window.pnc = {
  config: {
    userGuideUrl: 'https://localhost:3000/',
    userSupportUrl: 'https://localhost:3000/',
    keycloak: {
      url: 'https://localhost:3000/',
      realm: 'test',
      clientId: 'test',
    },
  },
};

const mockMatches = [
  { id: '0', pathname: '/', data: 'data', loaderData: 'loaderData', handle: '1', params: {} },
  { id: '0-1', pathname: '/products', data: 'data', loaderData: 'loaderData', handle: '2', params: {} },
];

beforeEach(() => {
  vi.spyOn(routeData, 'useMatches').mockReturnValue(mockMatches);
});

test('renders AppLayout', async () => {
  act(() => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );
  });
});
