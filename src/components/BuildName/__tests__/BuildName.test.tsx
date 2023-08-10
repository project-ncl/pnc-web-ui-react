import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildName } from 'components/BuildName/BuildName';

import mockBuildData from './data/mock-build-data.json';

jest.mock('services/keycloakService');
jest.mock('services/webConfigService');

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
