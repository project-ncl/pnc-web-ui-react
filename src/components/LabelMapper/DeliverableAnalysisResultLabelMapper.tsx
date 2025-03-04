import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const DELIVERABLE_ANALYSIS_RESULTS: ILabelMapper<DeliverableAnalyzerOperation['result']> = {
  SUCCESSFUL: {
    text: 'SUCCESSFUL',
    color: 'green',
  },
  FAILED: {
    text: 'FAILED',
    color: 'orange',
  },
  REJECTED: {
    text: 'REJECTED',
    color: 'orange',
  },
  CANCELLED: {
    text: 'CANCELLED',
    color: 'grey',
  },
  TIMEOUT: {
    text: 'TIMEOUT',
    color: 'grey',
  },
  SYSTEM_ERROR: {
    text: 'SYSTEM_ERROR',
    color: 'red',
  },
};

interface IDeliverableAnalysisResultLabelMapperProps {
  result: Exclude<DeliverableAnalyzerOperation['result'], undefined>;
}

export const DeliverableAnalysisResultLabelMapper = ({ result }: IDeliverableAnalysisResultLabelMapperProps) => (
  <LabelMapper mapperItem={DELIVERABLE_ANALYSIS_RESULTS[result]} />
);
