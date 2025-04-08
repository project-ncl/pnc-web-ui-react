import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';

import mockBuildData from './data/mock-build-data.json';

jest.mock('services/keycloakService');
jest.mock('services/webConfigService');

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
