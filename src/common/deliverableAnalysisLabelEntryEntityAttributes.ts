import { DeliverableAnalyzerLabelEntry, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export type AssignableDeliverableAnalysisLabel = Exclude<NonNullable<DeliverableAnalyzerReport['labels']>[number], 'SCRATCH'>;

const labelValues: AssignableDeliverableAnalysisLabel[] = ['RELEASED', 'DELETED'];

export const deliverableAnalysisLabelEntryEntityAttributes = {
  label: {
    id: 'label',
    title: 'Label',
    values: labelValues,
  },
  reason: {
    id: 'reason',
    title: 'Reason',
  },
} as const satisfies TEntityAttributes<DeliverableAnalyzerLabelEntry>;
