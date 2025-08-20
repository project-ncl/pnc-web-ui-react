import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { deliverableAnalysisColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';
import { withProtection } from 'components/ProtectedContent/ProtectedComponent';

type deliverableAnalysisLabel = Exclude<DeliverableAnalyzerReport['labels'], undefined>[number];

interface IDeliverableAnalysisLabelLabelMapperProps {
  label: deliverableAnalysisLabel;
  onRemove?: () => void;
  tooltip?: string;
  isDisabled?: boolean;
}

export const DeliverableAnalysisLabelLabelMapper = ({
  label,
  onRemove,
  tooltip,
  isDisabled = false,
}: IDeliverableAnalysisLabelLabelMapperProps) => {
  const config = deliverableAnalysisColorMap[label] ?? { text: label };
  return <LabelMapper mapperItem={config} onRemove={onRemove} tooltip={tooltip} isDisabled={isDisabled} />;
};

export const ProtectedDeliverableAnalysisLabelLabelMapper = withProtection(DeliverableAnalysisLabelLabelMapper, 'tooltip');
