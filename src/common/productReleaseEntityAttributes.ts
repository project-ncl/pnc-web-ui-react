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
  supportLevel: {
    id: 'supportLevel',
    title: 'Support Level',
    values: supportLevelValues,
    filter: {
      operator: '==',
    },
  },
} as const satisfies TEntityAttributes<ProductRelease>;
