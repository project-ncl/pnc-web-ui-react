import { Product } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const productEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  name: {
    id: 'name',
    title: 'Name',
    filter: {
      operator: '=like=',
    },
  },
  abbreviation: {
    id: 'abbreviation',
    title: 'Abbreviation',
    filter: {
      operator: '=like=',
    },
  },
  productManagers: {
    id: 'productManagers',
    title: 'Product Managers',
  },
  productPagesCode: {
    id: 'productPagesCode',
    title: 'Product Pages Code',
  },
} as const satisfies TEntityAttributes<Product>;
