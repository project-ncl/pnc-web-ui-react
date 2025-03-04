import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const DELIVERABLE_ANALYSIS_PROGRESS_STATUSES: ILabelMapper<DeliverableAnalyzerOperation['progressStatus']> = {
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

interface IDeliverableAnalysisProgressStatusLabelMapperProps {
  progressStatus: Exclude<DeliverableAnalyzerOperation['progressStatus'], undefined>;
}

export const DeliverableAnalysisProgressStatusLabelMapper = ({
  progressStatus,
}: IDeliverableAnalysisProgressStatusLabelMapperProps) => (
  <LabelMapper mapperItem={DELIVERABLE_ANALYSIS_PROGRESS_STATUSES[progressStatus]} />
);
