import { render } from '@testing-library/react';
import { Build, GroupBuild } from 'pnc-api-types-ts';
import { MemoryRouter } from 'react-router-dom';
import { BuildName } from '../BuildName';

import mockBuildData from './data/mock-build-data.json';

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
