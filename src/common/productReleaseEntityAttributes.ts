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
    sort: {},
    tooltip: "Release part of the Product Version, e.g. '0.GA' for Product Version '1.0'.",
  },
  releaseDate: {
    id: 'releaseDate',
    title: 'Release Date',
    sort: {},
    tooltip: 'Date the Product Milestone was released to the customers',
  },
  supportLevel: {
    id: 'supportLevel',
    title: 'Support Level',
    values: supportLevelValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  productMilestone: {
    id: 'productMilestone',
    title: 'Released In',
  },
  commonPlatformEnumeration: {
    id: 'commonPlatformEnumeration',
    title: 'Common Platform Enumeration (CPE)',
    tooltip:
      "Common Platform Enumeration associated with the Product Release. CPEs are used to map packages that are security-relevant and delivered via security errata back to products and by the CVE Engine to map errata to containers when grading (e.g. 'cpe:/a:redhat:jboss_data_grid:7.3.5'). Can be retrieved from the Product Pages.",
  },
  productPagesCode: {
    id: 'productPagesCode',
    title: 'Product Pages Code',
    tooltip: "Code associated with the Product Release on the Product Pages (e.g. 'rhdg-7-3.5').",
  },
} as const satisfies TEntityAttributes<ProductRelease>;
