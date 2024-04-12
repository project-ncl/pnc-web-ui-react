import { act, render } from '@testing-library/react';
import * as routeData from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import { PageLayout } from 'components/PageLayout/PageLayout';

jest.mock('services/keycloakService');
jest.mock('services/genericSettingsApi');
jest.mock('services/webConfigService');

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
  { id: '0', pathname: '/', data: 'data', handle: '1', params: {} },
  { id: '0-1', pathname: '/products', data: 'data', handle: '2', params: {} },
];

beforeEach(() => {
  jest.spyOn(routeData, 'useMatches').mockReturnValue(mockMatches);
});

test('renders PageLayout', () => {
  act(() => {
    render(
      <MemoryRouter>
        <PageLayout title="Rendering Test" children={null} />
      </MemoryRouter>
    );
  });
});
