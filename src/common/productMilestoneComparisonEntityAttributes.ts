import { TEntityAttributes } from 'common/entityAttributes';

export const productMilestoneComparisonEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  identifier: {
    id: 'identifier',
    title: 'Artifact Identifier',
    filter: {
      operator: '=like=',
    },
  },
} as const satisfies TEntityAttributes<any>;
