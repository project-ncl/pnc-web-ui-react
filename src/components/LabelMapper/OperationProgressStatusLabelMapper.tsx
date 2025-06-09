import { Operation } from 'common/operationEntityAttributes';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const OPERATION_PROGRESS_STATUSES: ILabelMapper<Operation['progressStatus']> = {
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

interface IOperationProgressStatusLabelMapperProps {
  progressStatus: Exclude<Operation['progressStatus'], undefined>;
}

export const OperationProgressStatusLabelMapper = ({ progressStatus }: IOperationProgressStatusLabelMapperProps) => (
  <LabelMapper mapperItem={OPERATION_PROGRESS_STATUSES[progressStatus]} />
);
