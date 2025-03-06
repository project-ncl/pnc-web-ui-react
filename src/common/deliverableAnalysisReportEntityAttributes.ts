import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const deliverableAnalysisReportEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  labels: {
    id: 'labels',
    title: 'Labels',
  },
} as const satisfies TEntityAttributes<DeliverableAnalyzerReport>;
