import { act, render } from '@testing-library/react';
import * as routeData from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

import { AppLayout } from '../AppLayout';

global.ResizeObserver = ResizeObserver;

jest.mock('services/keycloakService');
jest.mock('services/genericSettingsApi');
jest.mock('services/webConfigService');

window.pnc = {
  config: {
    userGuideUrl: 'https://localhost:3000/',
    keycloak: {
      url: 'https://localhost:3000/',
      realm: 'test',
      clientId: 'test',
    },
  },
};

const mockMatches = [
  { id: '0', pathname: '/', data: 'data', handle: '1', params: {} },
  { id: '0-1', pathname: '/products', data: 'data', handle: '2', params: {} },
];

beforeEach(() => {
  jest.spyOn(routeData, 'useMatches').mockReturnValue(mockMatches);
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
