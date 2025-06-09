import { Operation } from 'common/operationEntityAttributes';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const OPERATION_RESULTS: ILabelMapper<Operation['result']> = {
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

interface IOperationResultLabelMapperProps {
  result: Exclude<Operation['result'], undefined>;
}

export const OperationResultLabelMapper = ({ result }: IOperationResultLabelMapperProps) => (
  <LabelMapper mapperItem={OPERATION_RESULTS[result]} />
);
