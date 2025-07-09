import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { deliverableAnalysisColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

type deliverableAnalysisLabel = Exclude<DeliverableAnalyzerReport['labels'], undefined>[number];

interface IDeliverableAnalysisLabelLabelMapperProps {
  label: deliverableAnalysisLabel;
  onRemove?: () => void;
}

export const DeliverableAnalysisLabelLabelMapper = ({ label, onRemove }: IDeliverableAnalysisLabelLabelMapperProps) => {
  const config = deliverableAnalysisColorMap[label] ?? { text: label };
  return <LabelMapper mapperItem={config} onRemove={onRemove} />;
};
