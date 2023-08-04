import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const statusValues: ProductMilestoneCloseResult['status'][] = ['IN_PROGRESS', 'FAILED', 'SUCCEEDED', 'CANCELED', 'SYSTEM_ERROR'];

export const productMilestoneCloseResultEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  status: {
    id: 'status',
    title: 'Status',
    values: statusValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  startingDate: {
    id: 'startingDate',
    title: 'Close Started',
    sort: {},
  },
  endDate: {
    id: 'endDate',
    title: 'Close Finished',
    sort: {},
  },
} as const satisfies TEntityAttributes<ProductMilestoneCloseResult>;
