import { DeliverableAnalyzerLabelEntry, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export type DeliverableAnalysisLabel = NonNullable<DeliverableAnalyzerReport['labels']>[number];

export const deliverableAnalysisLabels = [
  {
    value: 'RELEASED',
    description:
      'Used to denote that the deliverables of the Analysis have been published to the customer. Delivered Artifacts from the Analysis will be included in dashboard statistics.',
  },
  {
    value: 'DELETED',
    description: 'Delivered Artifacts from Analysis with this label will not be included in dashboard statistics.',
  },
  {
    value: 'SCRATCH',
    description:
      'The Analysis run with this label serves for testing purposes. Delivered artifacts from the Analysis will not be included in dashboard statistics. This label can only be assigned at the start of the analysis.',
  },
] as const satisfies readonly { value: DeliverableAnalysisLabel; description: string }[];

export const deliverableAnalysisLabelEntryEntityAttributes = {
  label: {
    id: 'label',
    title: 'Label',
  },
  reason: {
    id: 'reason',
    title: 'Reason',
  },
} as const satisfies TEntityAttributes<DeliverableAnalyzerLabelEntry>;
