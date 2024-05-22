import { ProductVersion } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedProductVersion extends ProductVersion {
  // derived from product
  productName: any;
  productDescription: any;

  'attributes.brewTagPrefix': any; // derived from attributes
  currentProductMilestone: any;
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
  'attributes.brewTagPrefix': {
    id: 'attributes.brewTagPrefix',
    title: 'Brew Tag Prefix',
  },
  currentProductMilestone: {
    id: 'currentProductMilestone',
    title: 'Current Product Milestone',
  },
  latestProductMilestone: {
    id: 'latestProductMilestone',
    title: 'Latest Product Milestone',
  },
  latestProductRelease: {
    id: 'latestProductRelease',
    title: 'Latest Product Release',
  },
  productMilestones: {
    id: 'productMilestones',
    title: 'Milestones',
  },
  productReleases: {
    id: 'productReleases',
    title: 'Releases',
  },
} as const satisfies TEntityAttributes<IExtendedProductVersion>;
