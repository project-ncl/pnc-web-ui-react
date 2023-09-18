import { act, render, screen, waitFor } from '@testing-library/react';
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

test('renders AppLayout', async () => {
  act(() => {
    render(
      <MemoryRouter>
        <AppLayout>
          <div>TEST CONTENT</div>
        </AppLayout>
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(screen.getByText('TEST CONTENT')).toBeInTheDocument();
  });
});
