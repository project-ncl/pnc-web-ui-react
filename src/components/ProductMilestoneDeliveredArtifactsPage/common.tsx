import { artifactEntityAttributes } from 'common/artifactEntityAttributes';

import { TFilterPreset } from 'components/FilteringPreset/FilteringPreset';

export const getBuiltInThisMilestoneFilterPreset = (productMilestoneId: string): TFilterPreset => [
  {
    id: artifactEntityAttributes['build.productMilestone.id'].id,
    operator: '==' as const,
    values: [productMilestoneId],
  },
];

export const getBuiltInOtherMilestonesFilterPreset = (productMilestoneId: string, productId: string): TFilterPreset => [
  {
    id: artifactEntityAttributes['build.productMilestone.id'].id,
    operator: '==' as const,
    values: [`!${productMilestoneId}`],
  },
  {
    id: artifactEntityAttributes['build.productMilestone.productVersion.product.id'].id,
    operator: '==' as const,
    values: [productId],
  },
];

export const getBuiltInOtherProductsFilterPreset = (productId: string): TFilterPreset => [
  {
    id: artifactEntityAttributes['build.productMilestone.productVersion.product.id'].id,
    operator: '==' as const,
    values: [`!${productId}`],
  },
];

export const builtOutsideMilestoneFilterPreset = [
  {
    id: artifactEntityAttributes['build.productMilestone'].id,
    operator: '==' as const,
    values: ['null'],
  },
];

export const notBuiltFilterPreset = [
  { id: artifactEntityAttributes.artifactQuality.id, operator: '==' as const, values: ['IMPORTED'] },
];

export const notBuiltFoundFilterPreset = [
  ...notBuiltFilterPreset,
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['NPM', 'MAVEN', 'GENERIC_PROXY'],
  },
];

export const notBuiltNotFoundFilterPreset = [
  ...notBuiltFilterPreset,
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['DISTRIBUTION_ARCHIVE'],
  },
];

export const getDeliveredArtifactsNonZeroValueWarning = (isWarning: boolean, totalHits: number) =>
  `Non-zero value may indicate a problem.${isWarning ? ` There are ${totalHits} existing artifacts to be reviewed.` : ''}`;
