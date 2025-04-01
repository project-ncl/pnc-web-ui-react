import { DeliverableAnalyzerLabelEntry, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export type DeliverableAnalysisLabel = NonNullable<DeliverableAnalyzerReport['labels']>[number];

export type EditableDeliverableAnalysisLabel = Exclude<DeliverableAnalysisLabel, 'SCRATCH'>;

const labelValues: EditableDeliverableAnalysisLabel[] = ['RELEASED', 'DELETED'];

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
