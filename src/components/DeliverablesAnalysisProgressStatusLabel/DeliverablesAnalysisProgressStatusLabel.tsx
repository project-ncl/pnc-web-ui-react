import { Label } from '@patternfly/react-core';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { ILabelMapper } from 'components/ArtifactQualityLabel/ArtifactQualityLabel';
import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';

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
  const deliverablesAnalysisProgressStatus = DELIVERABLES_ANALYSIS_PROGRESS_STATUSES[progressStatus];

  return deliverablesAnalysisProgressStatus ? (
    <Label color={deliverablesAnalysisProgressStatus.color}>{deliverablesAnalysisProgressStatus.text}</Label>
  ) : (
    <EmptyStateSymbol />
  );
};
