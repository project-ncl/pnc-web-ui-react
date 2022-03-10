import { render } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/keycloakService');

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
