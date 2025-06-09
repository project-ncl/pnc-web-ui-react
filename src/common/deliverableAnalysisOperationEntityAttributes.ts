import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';
import { operationEntityAttributes } from 'common/operationEntityAttributes';

interface IExtendedDeliverableAnalyzerOperation extends DeliverableAnalyzerOperation {
  'user.username': string;
  'productMilestone.version': string;
  deliverablesUrls: string;
  runAsScratchAnalysis: boolean;
}

export const deliverableAnalysisOperationEntityAttributes = {
  ...operationEntityAttributes,
  'productMilestone.version': {
    id: 'productMilestone.version',
    title: 'Milestone Version',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  deliverablesUrls: {
    id: 'deliverablesUrls',
    title: 'Deliverables URLs',
  },
  runAsScratchAnalysis: {
    id: 'runAsScratchAnalysis',
    title: 'Run as Scratch',
    tooltip: "This analysis will be run as a 'scratch' analysis, perhaps for testing purposes.",
  },
} as const satisfies TEntityAttributes<IExtendedDeliverableAnalyzerOperation>;
