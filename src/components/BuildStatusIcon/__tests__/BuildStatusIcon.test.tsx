import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';

import mockBuildData from './data/mock-build-data.json';

vi.mock('services/keycloakService');
vi.mock('services/genericSettingsApi');
vi.mock('services/webConfigService');
vi.mock('services/broadcastService');

describe('display BuildStatusIcon component', () => {
  test('renders all BuildStatusIcon variants', () => {
    (mockBuildData as (Build | GroupBuild)[]).forEach((build) =>
      render(
        <MemoryRouter>
          <BuildStatusIcon build={build} />
        </MemoryRouter>
      )
    );
  });
});
