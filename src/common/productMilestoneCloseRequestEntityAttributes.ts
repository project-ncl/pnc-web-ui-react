import { MilestoneCloseRequest } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const productMilestoneCloseRequestEntityAttributes = {
  skipBrewPush: {
    id: 'skipBrewPush',
    title: 'Skip Brew push',
    tooltip: 'Brew push of the Builds in the Milestone will be skipped and the Milestone will be closed immediately.',
  },
} as const satisfies TEntityAttributes<MilestoneCloseRequest>;
