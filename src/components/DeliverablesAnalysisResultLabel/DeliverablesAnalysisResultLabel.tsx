import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { Label } from 'components/Label/Label';
import { ILabelMapper } from 'components/Label/Label';

const DELIVERABLES_ANALYSIS_RESULTS: ILabelMapper = {
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

interface IDeliverablesAnalysisResultLabelProps {
  result: Exclude<DeliverableAnalyzerOperation['result'], undefined>;
}

export const DeliverablesAnalysisResultLabel = ({ result }: IDeliverablesAnalysisResultLabelProps) => {
  return <Label labelObject={DELIVERABLES_ANALYSIS_RESULTS[result]}></Label>;
};
