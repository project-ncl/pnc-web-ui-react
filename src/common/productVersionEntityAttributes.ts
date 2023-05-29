import { ProductVersion } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

interface IExtendedProductVersion extends ProductVersion {
  // derived from product
  productName: any;
  productDescription: any;

  breTagPrefix: any; // derived from attributes
  latestProductMilestone: any; // derived from productMilestones
  latestProductRelease: any; // derived from productReleases
}

export const productVersionEntityAttributes = {
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
  productName: {
    id: 'productName',
    title: 'Product Name',
  },
  productDescription: {
    id: 'productDescription',
    title: 'Product Description',
  },
  breTagPrefix: {
    id: 'breTagPrefix',
    title: 'Brew Tag Prefix',
  },
  latestProductMilestone: {
    id: 'latestProductMilestone',
    title: 'Latest Product Milestone',
  },
  latestProductRelease: {
    id: 'latestProductRelease',
    title: 'Latest Product Release',
  },
} as const satisfies IEntityAttributes<IExtendedProductVersion>;
