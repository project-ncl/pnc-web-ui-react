import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';

import mockBuildData from './data/mock-build-data.json';

vi.mock('services/keycloakService');
vi.mock('services/webConfigService');

describe('display BuildStatus component', () => {
  test('renders all BuildStatus variants', () => {
    (mockBuildData as (Build | GroupBuild)[]).forEach((build) =>
      render(
        <MemoryRouter>
          <BuildStatus build={build} long includeBuildLink includeConfigLink />
        </MemoryRouter>
      )
    );
  });
});
