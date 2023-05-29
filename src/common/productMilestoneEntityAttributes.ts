import { ProductMilestone } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

interface IExtendedProductMilestone extends ProductMilestone {
  status: any; // derived from endDate
  lastCloseResult: any; // loaded from getCloseResults
}

export const productMilestoneEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  version: {
    id: 'version',
    title: 'Name',
    filter: {
      operator: '=like=',
    },
  },
  status: {
    id: 'status',
    title: 'Status',
  },
  startingDate: {
    id: 'startingDate',
    title: 'Start Date',
  },
  plannedEndDate: {
    id: 'plannedEndDate',
    title: 'Planned End Date',
  },
  endDate: {
    id: 'endDate',
    title: 'End Date',
  },
  lastCloseResult: {
    id: 'lastCloseResult',
    title: 'Last Close Result',
  },
} as const satisfies IEntityAttributes<IExtendedProductMilestone>;
