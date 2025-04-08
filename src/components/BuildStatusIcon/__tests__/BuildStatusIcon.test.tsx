import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';

import mockBuildData from './data/mock-build-data.json';

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
