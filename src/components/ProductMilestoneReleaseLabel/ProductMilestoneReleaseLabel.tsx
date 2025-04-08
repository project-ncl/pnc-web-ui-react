import { Button, Tooltip } from '@patternfly/react-core';
import { Link } from 'react-router';

import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';

import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';

import { DateTime } from 'components/DateTime/DateTime';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';

import { isProductMilestone, isProductRelease } from 'utils/entityRecognition';

import styles from './ProductMilestoneReleaseLabel.module.css';

interface IProductMilestoneReleaseProp {
  productMilestoneRelease: ProductMilestone | ProductRelease;
  isCurrent: boolean;
  link?: string;
  productName?: string;
}

/**
 * Show Product Milestone or Release label with specific text and toolips.
 *
 * @param productMilestoneRelease - ProductMilestone or ProductRelease component to be displayed
 * @param isCurrent - If the ProductMilestone is current one
 * @param link - Link to navigate to
 * @param productName - Name of a Product containing the Milestone/Release
 */
export const ProductMilestoneReleaseLabel = ({
  productMilestoneRelease,
  isCurrent,
  link,
  productName,
}: IProductMilestoneReleaseProp) => {
  let tooltipContent;
  let buttonClassName;
  let labelType;
  if (isProductMilestone(productMilestoneRelease)) {
    const productMilestone = productMilestoneRelease as ProductMilestone;
    labelType = 'milestone';
    tooltipContent = (
      <div className={styles['tooltip-text']}>
        <strong>{productMilestoneEntityAttributes.startingDate.title}: </strong>
        {(productMilestone.startingDate && <DateTime date={productMilestone.startingDate} displayTime={false} />) || (
          <EmptyStateSymbol text={false} />
        )}
        <br />
        <strong>{productMilestoneEntityAttributes.plannedEndDate.title}: </strong>
        {(productMilestone.plannedEndDate && <DateTime date={productMilestone.plannedEndDate} displayTime={false} />) || (
          <EmptyStateSymbol text={false} />
        )}
        <br />
        <strong>{productMilestoneEntityAttributes.endDate.title}: </strong>
        {(productMilestone.endDate && <DateTime date={productMilestone.endDate} displayTime={false} />) || (
          <EmptyStateSymbol text={false} />
        )}
      </div>
    );
    buttonClassName = isCurrent ? `${styles['milestone-label']} ${styles['is-current']}` : `${styles['milestone-label']}`;
  } else if (isProductRelease(productMilestoneRelease)) {
    labelType = 'release';
    const productRelease = productMilestoneRelease as ProductRelease;
    tooltipContent = (
      <div className={styles['toolip-text']}>
        <strong>{productReleaseEntityAttributes.releaseDate.title}: </strong>
        {(productRelease.releaseDate && <DateTime date={productRelease.releaseDate} displayTime={false} />) || (
          <EmptyStateSymbol text={false} />
        )}
        <br />
        <strong>{productReleaseEntityAttributes.supportLevel.title}: </strong>
        {productRelease.supportLevel}
      </div>
    );
    buttonClassName = `${styles['release-label']}`;
  }
  return (
    <span className={styles.label}>
      <Tooltip content={tooltipContent} isContentLeftAligned={true} position="auto">
        <Button
          size="sm"
          className={buttonClassName}
          component={link && labelType === 'milestone' ? (props: any) => <Link {...props} to={link} /> : 'span'}
        >
          {productName} {productMilestoneRelease.version}
        </Button>
      </Tooltip>
    </span>
  );
};
