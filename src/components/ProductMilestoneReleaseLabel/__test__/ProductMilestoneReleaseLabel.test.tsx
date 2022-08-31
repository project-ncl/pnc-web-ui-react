import { render, screen } from '@testing-library/react';

import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';

import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';

import productMilestoneMock from './data/product-milestones-mock.json';
import productReleaseMock from './data/product-releases-mock.json';

describe('display MilestoneReleaseLabel component', () => {
  test('renders MilestoneReleaseLabels', () => {
    let testMilestoneDataList = productMilestoneMock as unknown as ProductMilestone[];
    let testReleaseDataList = productReleaseMock as unknown as ProductRelease[];
    render(
      <>
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
      </>
    );
    const firstLabel = screen.getByText(testMilestoneDataList[0].version as string);
    const secondLabel = screen.getByText(testMilestoneDataList[1].version as string);
    const thirdLabel = screen.getByText(testReleaseDataList[0].version as string);
    expect(firstLabel).toHaveClass('milestone-label');
    expect(secondLabel).toHaveClass('milestone-label is-current');
    expect(thirdLabel).toHaveClass('release-label');
  });

  test('compare snapshot with previous record', () => {
    let testMilestoneDataList = productMilestoneMock as unknown as ProductMilestone[];
    let testReleaseDataList = productReleaseMock as unknown as ProductRelease[];

    const tree = render(
      <>
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
      </>
    );
    expect(tree).toMatchSnapshot();
  });
});
