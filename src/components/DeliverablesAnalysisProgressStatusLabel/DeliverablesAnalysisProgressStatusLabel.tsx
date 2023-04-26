import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { Label } from 'components/Label/Label';
import { ILabelMapper } from 'components/Label/Label';

const DELIVERABLES_ANALYSIS_PROGRESS_STATUSES: ILabelMapper = {
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

export const DeliverablesAnalysisProgressStatusLabel = ({ progressStatus }: IDeliverablesAnalysisStatusLabelProps) => {
  return <Label labelObject={DELIVERABLES_ANALYSIS_PROGRESS_STATUSES[progressStatus]}></Label>;
};
