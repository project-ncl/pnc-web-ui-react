import { fireEvent, render, screen } from '@testing-library/react';
import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';
import { MilestoneReleaseLabel } from '../MilestoneReleaseLabel';
import mockMilestoneReleaseData from './data/mock-milestone-release-data.json';

describe('display MilestoneReleaseLabel component', () => {
  test('renders MilestoneReleaseLabels', () => {
    let testDataList = mockMilestoneReleaseData as (ProductMilestone | ProductRelease)[];
    let data1 = testDataList[0] as ProductMilestone;
    let data2 = testDataList[1] as ProductMilestone;
    let data3 = testDataList[2] as ProductRelease;
    render(
      <>
        <MilestoneReleaseLabel milestoneRelease={data1} isCurrent={false}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel milestoneRelease={testDataList[1]} isCurrent={true}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel milestoneRelease={testDataList[2]} isCurrent={false}></MilestoneReleaseLabel>
      </>
    );
    const firstLabel = screen.getByText(data1.version as string);
    const secondLabel = screen.getByText(data2.version as string);
    const thirdLabel = screen.getByText(data3.version as string);
    expect(firstLabel).toHaveClass('milestone-label');
    expect(secondLabel).toHaveClass('milestone-label is-current');
    expect(thirdLabel).toHaveClass('release-label');
  });

  test('compare snapshot with previous record', () => {
    let testDataList = mockMilestoneReleaseData as (ProductMilestone | ProductRelease)[];

    const tree = render(
      <>
        <MilestoneReleaseLabel milestoneRelease={testDataList[0]} isCurrent={false}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel milestoneRelease={testDataList[1]} isCurrent={true}></MilestoneReleaseLabel>
        <MilestoneReleaseLabel milestoneRelease={testDataList[2]} isCurrent={false}></MilestoneReleaseLabel>
      </>
    );
    expect(tree).toMatchSnapshot();
  });
});
