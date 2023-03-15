import { Label } from '@patternfly/react-core';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { ILabelMapper } from 'components/ArtifactQualityLabel/ArtifactQualityLabel';
import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';

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
  const deliverablesAnalysisResult = DELIVERABLES_ANALYSIS_RESULTS[result];

  return deliverablesAnalysisResult ? (
    <Label color={deliverablesAnalysisResult.color}>{deliverablesAnalysisResult.text}</Label>
  ) : (
    <EmptyStateSymbol />
  );
};
