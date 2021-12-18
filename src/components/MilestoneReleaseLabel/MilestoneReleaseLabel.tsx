import { Button, Tooltip } from '@patternfly/react-core';
import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';
import './MilestoneReleaseLabel.css';

interface IMilestoneReleaseProp {
  milestoneRelease: ProductMilestone | ProductRelease;
  isCurrent: boolean;
}

/**
 * Show Milestone or Release label with specific text and toolips.
 *
 * @param milestoneRelease - ProductMilestone or ProductRelease component to be displayed
 *
 * @param isCurrent - If the ProductMilestone is current one
 */
export const MilestoneReleaseLabel = ({ milestoneRelease, isCurrent }: IMilestoneReleaseProp) => {
  let tooltipContent;
  let buttonClassName;
  let labelType;
  if ('startingDate' in milestoneRelease) {
    // A milestone object passed in
    labelType = 'milestone';
    tooltipContent = (
      <div className="tooltip-text">
        <strong>Start Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(milestoneRelease.startingDate as string))}
        <br />
        <strong>Planned End Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(milestoneRelease.plannedEndDate as string))}
        <br />
        <strong>End Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(milestoneRelease.endDate as string))}
      </div>
    );
    buttonClassName = isCurrent ? 'milestone-label is-current' : 'milestone-label';
  } else {
    // A release object passed in
    labelType = 'release';
    milestoneRelease = milestoneRelease as ProductRelease;
    tooltipContent = (
      <div className="tooltip-text">
        <strong>Release Date: </strong>
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(milestoneRelease.releaseDate as string))}
        <br />
        <strong>Support Level: </strong>
        {milestoneRelease.supportLevel}
        <br />
      </div>
    );
    buttonClassName = 'release-label';
  }
  return (
    <>
      <span className="label">
        <Tooltip content={tooltipContent} isContentLeftAligned={true} position="auto">
          <Button isSmall={true} className={buttonClassName} component={labelType === 'milestone' ? 'a' : 'span'} href="#">
            {milestoneRelease.version}
          </Button>
        </Tooltip>
      </span>
    </>
  );
};
