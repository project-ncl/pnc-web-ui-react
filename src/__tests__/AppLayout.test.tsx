import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppLayout } from '../AppLayout';

jest.mock('../services/keycloakService');
jest.mock('../services/genericSettingsService');

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

test('renders AppLayout', () => {
  render(
    <MemoryRouter>
      <AppLayout>
        <div></div>
      </AppLayout>
    </MemoryRouter>
  );
});
