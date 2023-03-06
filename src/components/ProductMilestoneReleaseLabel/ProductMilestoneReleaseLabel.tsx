import { Button, Tooltip } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';

import { isProductMilestone, isProductRelease } from 'utils/entityRecognition';
import { createDateTime } from 'utils/utils';

import styles from './ProductMilestoneReleaseLabel.module.css';

interface IProductMilestoneReleaseProp {
  productMilestoneRelease: ProductMilestone | ProductRelease;
  isCurrent: boolean;
  link?: string;
}

/**
 * Show Product Milestone or Release label with specific text and toolips.
 *
 * @param productMilestoneRelease - ProductMilestone or ProductRelease component to be displayed
 * @param isCurrent - If the ProductMilestone is current one
 * @param link - Link to navigate to
 */
export const ProductMilestoneReleaseLabel = ({ productMilestoneRelease, isCurrent, link }: IProductMilestoneReleaseProp) => {
  const navigate = useNavigate();

  let tooltipContent;
  let buttonClassName;
  let labelType;
  if (isProductMilestone(productMilestoneRelease)) {
    const productMilestone = productMilestoneRelease as ProductMilestone;
    labelType = 'milestone';
    tooltipContent = (
      <div className={styles['tooltip-text']}>
        <strong>Start Date: </strong>
        {createDateTime({ date: productMilestone.startingDate!, includeTime: false }) || <>&ndash;</>}
        <br />
        <strong>Planned End Date: </strong>
        {createDateTime({ date: productMilestone.plannedEndDate!, includeTime: false }) || <>&ndash;</>}
        <br />
        <strong>End Date: </strong>
        {createDateTime({ date: productMilestone.endDate!, includeTime: false }) || <>&ndash;</>}
      </div>
    );
    buttonClassName = isCurrent ? `${styles['milestone-label']} ${styles['is-current']}` : `${styles['milestone-label']}`;
  } else if (isProductRelease(productMilestoneRelease)) {
    labelType = 'release';
    const productRelease = productMilestoneRelease as ProductRelease;
    tooltipContent = (
      <div className={styles['toolip-text']}>
        <strong>Release Date: </strong>
        {createDateTime({ date: productRelease.releaseDate!, includeTime: false }) || <>&ndash;</>}
        <br />
        <strong>Support Level: </strong>
        {productRelease.supportLevel}
      </div>
    );
    buttonClassName = `${styles['release-label']}`;
  }
  return (
    <span className={styles.label}>
      <Tooltip removeFindDomNode content={tooltipContent} isContentLeftAligned={true} position="auto">
        <Button
          onClick={link ? () => navigate(link) : undefined}
          isSmall={true}
          className={buttonClassName}
          component={labelType === 'milestone' ? 'a' : 'span'}
        >
          {productMilestoneRelease.version}
        </Button>
      </Tooltip>
    </span>
  );
};
