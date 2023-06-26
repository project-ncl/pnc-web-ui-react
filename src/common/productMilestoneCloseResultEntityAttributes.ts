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
  },
  startingDate: {
    id: 'startingDate',
    title: 'Close Started',
  },
  endDate: {
    id: 'endDate',
    title: 'Close Finished',
  },
} as const satisfies TEntityAttributes<ProductMilestoneCloseResult>;