import { ProductRelease } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const supportLevelValues: ProductRelease['supportLevel'][] = [
  'UNRELEASED',
  'EARLYACCESS',
  'SUPPORTED',
  'EXTENDED_SUPPORT',
  'EOL',
];
export const productReleaseEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  version: {
    id: 'version',
    title: 'Version',
    filter: {
      operator: '=like=',
    },
  },
  releaseDate: {
    id: 'releaseDate',
    title: 'Release Date',
  },
  supportLevel: {
    id: 'supportLevel',
    title: 'Support Level',
    values: supportLevelValues,
    filter: {
      operator: '==',
    },
  },
  productMilestone: {
    id: 'productMilestone',
    title: 'Released In',
  },
} as const satisfies TEntityAttributes<ProductRelease>;
