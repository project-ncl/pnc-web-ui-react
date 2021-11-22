import { render } from '@testing-library/react';
import { Build, GroupBuild } from 'pnc-api-types-ts';
import { MemoryRouter } from 'react-router-dom';
import { BuildStatus } from '../BuildStatus';

import mockBuildData from './data/mock-build-data.json';

describe('display BuildStatus component', () => {
  test('renders all BuildStatus variants', () => {
    (mockBuildData as (Build | GroupBuild)[]).forEach((build) =>
      render(
        <MemoryRouter>
          <BuildStatus build={build} long />
        </MemoryRouter>
      )
    );
  });
});
