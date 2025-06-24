import { operationResultColorMap } from 'common/colorMap';
import { Operation } from 'common/operationEntityAttributes';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IOperationResultLabelMapperProps {
  result: Exclude<Operation['result'], undefined>;
}

export const OperationResultLabelMapper = ({ result }: IOperationResultLabelMapperProps) => {
  const config = operationResultColorMap[result] ?? { text: result };
  return <LabelMapper mapperItem={config} />;
};
