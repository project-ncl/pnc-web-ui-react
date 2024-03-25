import { ProductMilestone } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedProductMilestone extends ProductMilestone {
  status: any; // derived from endDate
  lastCloseResult: any; // loaded from getCloseResults
  isCurrent: boolean; // loaded from Product Version
}

export const productMilestoneEntityAttributes = {
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
  },
  status: {
    id: 'status',
    title: 'Status',
  },
  startingDate: {
    id: 'startingDate',
    title: 'Start Date',
    sort: {},
  },
  plannedEndDate: {
    id: 'plannedEndDate',
    title: 'Planned End Date',
    sort: {},
  },
  endDate: {
    id: 'endDate',
    title: 'End Date',
    sort: {},
  },
  lastCloseResult: {
    id: 'lastCloseResult',
    title: 'Last Close Result',
  },
  isCurrent: {
    id: 'isCurrent',
    title: 'Is Product Milestone Current',
  },
} as const satisfies TEntityAttributes<IExtendedProductMilestone>;
