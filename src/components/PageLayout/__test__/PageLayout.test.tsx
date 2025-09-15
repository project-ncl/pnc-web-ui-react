import { act, render } from '@testing-library/react';
import * as routeData from 'react-router';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { PageLayout } from 'components/PageLayout/PageLayout';

vi.mock('services/keycloakService');
vi.mock('services/genericSettingsApi');
vi.mock('services/webConfigService');

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

test('renders PageLayout', () => {
  render(
    <MemoryRouter>
      <PageLayout title="Rendering Test" children={null} />
    </MemoryRouter>
  );
});
