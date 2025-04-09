import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

type deliverableAnalysisLabel = Exclude<DeliverableAnalyzerReport['labels'], undefined>[number];

const DELIVERABLE_ANALYSIS_LABELS: ILabelMapper<deliverableAnalysisLabel> = {
  DELETED: {
    text: 'DELETED',
    color: 'red',
  },
  SCRATCH: {
    text: 'SCRATCH',
    color: 'grey',
  },
  RELEASED: {
    text: 'RELEASED',
    color: 'blue',
  },
};

interface IDeliverableAnalysisLabelLabelMapperProps {
  label: deliverableAnalysisLabel;
  onRemove?: () => void;
}

export const DeliverableAnalysisLabelLabelMapper = ({ label, onRemove }: IDeliverableAnalysisLabelLabelMapperProps) => (
  <LabelMapper mapperItem={DELIVERABLE_ANALYSIS_LABELS[label]} onRemove={onRemove} />
);
