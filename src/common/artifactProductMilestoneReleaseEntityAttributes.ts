import { MilestoneInfo } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';
import { productEntityAttributes } from 'common/productEntityAttributes';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';
import { productVersionEntityAttributes } from 'common/productVersionEntityAttributes';

export const artifactProductMilestoneReleaseEntityAttributes = {
  productName: {
    id: 'productName',
    title: `Product ${productEntityAttributes.name.title}`,
  },
  productVersionVersion: {
    id: 'productVersionVersion',
    title: `Product ${productVersionEntityAttributes.version.title}`,
  },
  milestoneVersion: {
    id: 'milestoneVersion',
    title: `Milestone ${productMilestoneEntityAttributes.version.title}`,
  },
  milestoneEndDate: {
    id: 'milestoneEndDate',
    title: `Milestone ${productMilestoneEntityAttributes.endDate.title}`,
  },
  releaseVersion: {
    id: 'releaseVersion',
    title: `Release ${productReleaseEntityAttributes.version.title}`,
  },
  releaseReleaseDate: {
    id: 'releaseReleaseDate',
    title: productReleaseEntityAttributes.releaseDate.title,
    tooltip: productReleaseEntityAttributes.releaseDate.tooltip,
  },
} as const satisfies TEntityAttributes<MilestoneInfo>;
