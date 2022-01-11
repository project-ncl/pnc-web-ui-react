import { Button, Tooltip } from '@patternfly/react-core';
import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';
import { isProductMilestone, isProductRelease } from '../../utils/entityRecognition';
import './MilestoneReleaseLabel.css';

interface IProductMilestoneReleaseProp {
  productMilestoneRelease: ProductMilestone | ProductRelease;
  isCurrent: boolean;
}

/**
 * Show Milestone or Release label with specific text and toolips.
 *
 * @param milestoneRelease - ProductMilestone or ProductRelease component to be displayed
 *
 * @param isCurrent - If the ProductMilestone is current one
 */
export const MilestoneReleaseLabel = ({ productMilestoneRelease, isCurrent }: IProductMilestoneReleaseProp) => {
  let tooltipContent;
  let buttonClassName;
  let labelType;
  if (isProductMilestone(productMilestoneRelease)) {
    const productMilestone = productMilestoneRelease as ProductMilestone;
    labelType = 'milestone';
    tooltipContent = (
      <div className="tooltip-text">
        <strong>Start Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(productMilestone.startingDate as string))}
        <br />
        <strong>Planned End Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(productMilestone.plannedEndDate as string))}
        <br />
        <strong>End Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(productMilestone.endDate as string))}
      </div>
    );
    buttonClassName = isCurrent ? 'milestone-label is-current' : 'milestone-label';
  } else if (isProductRelease(productMilestoneRelease)) {
    labelType = 'release';
    const productRelease = productMilestoneRelease as ProductRelease;
    tooltipContent = (
      <div className="tooltip-text">
        <strong>Release Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(productRelease.releaseDate as string))}
        <br />
        <strong>Support Level: </strong>
        {productRelease.supportLevel}
      </div>
    );
    buttonClassName = 'release-label';
  }
  return (
    <span className="label">
      <Tooltip content={tooltipContent} isContentLeftAligned={true} position="auto">
        <Button isSmall={true} className={buttonClassName} component={labelType === 'milestone' ? 'a' : 'span'} href="#">
          {productMilestoneRelease.version}
        </Button>
      </Tooltip>
    </span>
  );
};
