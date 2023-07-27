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
    filter: productEntityAttributes.name.filter,
  },
  productVersionVersion: {
    id: 'productVersionVersion',
    title: `Product ${productVersionEntityAttributes.version.title}`,
    filter: productVersionEntityAttributes.version.filter,
  },
  milestoneVersion: {
    id: 'milestoneVersion',
    title: `Milestone ${productMilestoneEntityAttributes.version.title}`,
    filter: productMilestoneEntityAttributes.version.filter,
  },
  milestoneEndDate: {
    id: 'milestoneEndDate',
    title: `Milestone ${productMilestoneEntityAttributes.endDate.title}`,
    sort: {},
  },
  releaseVersion: {
    id: 'releaseVersion',
    title: `Release ${productReleaseEntityAttributes.version.title}`,
    filter: productReleaseEntityAttributes.version.filter,
  },
  releaseReleaseDate: {
    id: 'releaseReleaseDate',
    title: productReleaseEntityAttributes.releaseDate.title,
    tooltip: productReleaseEntityAttributes.releaseDate.tooltip,
    sort: {},
  },
} as const satisfies TEntityAttributes<MilestoneInfo>;
