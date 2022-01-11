import { fireEvent, render, screen } from '@testing-library/react';
import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';
import { MilestoneReleaseLabel } from '../MilestoneReleaseLabel';
import productMilestoneMock from './data/product-milestones-mock.json';
import productReleaseMock from './data/product-releases-mock.json';

describe('display MilestoneReleaseLabel component', () => {
  test('renders MilestoneReleaseLabels', () => {
    let testMilestoneDataList = productMilestoneMock as unknown as ProductMilestone[];
    let testReleaseDataList = productReleaseMock as unknown as ProductRelease[];
    render(
      <>
        <MilestoneReleaseLabel productMilestoneRelease={testMilestoneDataList[0]} isCurrent={false}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel productMilestoneRelease={testMilestoneDataList[1]} isCurrent={true}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel productMilestoneRelease={testReleaseDataList[0]} isCurrent={false}></MilestoneReleaseLabel>
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
        <MilestoneReleaseLabel productMilestoneRelease={testMilestoneDataList[0]} isCurrent={false}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel productMilestoneRelease={testMilestoneDataList[1]} isCurrent={true}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel productMilestoneRelease={testReleaseDataList[0]} isCurrent={false}></MilestoneReleaseLabel>
      </>
    );
    expect(tree).toMatchSnapshot();
  });
});
