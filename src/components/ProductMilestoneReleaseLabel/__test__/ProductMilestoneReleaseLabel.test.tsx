import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';

import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';

import productMilestoneMock from './data/product-milestones-mock.json';
import productReleaseMock from './data/product-releases-mock.json';

vi.mock('services/keycloakService');
vi.mock('services/webConfigService');

describe('display MilestoneReleaseLabel component', () => {
  test('compare snapshot with previous record', () => {
    let testMilestoneDataList = productMilestoneMock as unknown as ProductMilestone[];
    let testReleaseDataList = productReleaseMock as unknown as ProductRelease[];

    const tree = render(
      <MemoryRouter>
        <ProductMilestoneReleaseLabel
          productMilestoneRelease={testMilestoneDataList[0]}
          isCurrent={false}
        ></ProductMilestoneReleaseLabel>
        <ProductMilestoneReleaseLabel
          productMilestoneRelease={testMilestoneDataList[1]}
          isCurrent={true}
        ></ProductMilestoneReleaseLabel>
        <ProductMilestoneReleaseLabel
          productMilestoneRelease={testReleaseDataList[0]}
          isCurrent={false}
        ></ProductMilestoneReleaseLabel>
      </MemoryRouter>
    );
    expect(tree.container).toMatchSnapshot();
  });
});
