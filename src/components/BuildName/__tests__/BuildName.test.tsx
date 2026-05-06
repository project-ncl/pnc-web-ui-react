import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildName } from 'components/BuildName/BuildName';

import mockBuildData from './data/mock-build-data.json';

vi.mock('services/keycloakService');
vi.mock('services/webConfigService');

describe('display BuildName component', () => {
  test('renders all BuildName variants', () => {
    (mockBuildData as (Build | GroupBuild)[]).forEach((build) =>
      render(
        <MemoryRouter>
          <BuildName build={build} long includeBuildLink includeConfigLink />
        </MemoryRouter>
      )
    );
  });
});
