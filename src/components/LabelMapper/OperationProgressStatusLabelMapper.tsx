import { operationProgressStatusColorMap } from 'common/colorMap';
import { Operation } from 'common/operationEntityAttributes';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IOperationProgressStatusLabelMapperProps {
  progressStatus: Exclude<Operation['progressStatus'], undefined>;
}

export const OperationProgressStatusLabelMapper = ({ progressStatus }: IOperationProgressStatusLabelMapperProps) => {
  const config = operationProgressStatusColorMap[progressStatus]!;
  return <LabelMapper mapperItem={config} />;
};
