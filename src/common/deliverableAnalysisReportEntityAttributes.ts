import { TEntityAttributes } from 'common/entityAttributes';
import { DeliverableAnalyzerReport } from 'common/pnc-api-types-ts';

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
