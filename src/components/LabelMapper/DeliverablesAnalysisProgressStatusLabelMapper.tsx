import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const DELIVERABLES_ANALYSIS_PROGRESS_STATUSES: ILabelMapper<DeliverableAnalyzerOperation['progressStatus']> = {
  NEW: {
    text: 'NEW',
    color: 'grey',
  },
  PENDING: {
    text: 'PENDING',
    color: 'grey',
  },
  IN_PROGRESS: {
    text: 'IN PROGRESS',
    color: 'blue',
  },
  FINISHED: {
    text: 'FINISHED',
    color: 'green',
  },
};

interface IDeliverablesAnalysisStatusLabelProps {
  progressStatus: Exclude<DeliverableAnalyzerOperation['progressStatus'], undefined>;
}

export const DeliverablesAnalysisProgressStatusLabel = ({ progressStatus }: IDeliverablesAnalysisStatusLabelProps) => (
  <LabelMapper mapper={DELIVERABLES_ANALYSIS_PROGRESS_STATUSES[progressStatus]} />
);
