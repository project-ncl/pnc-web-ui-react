import { BuildPushResult } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const BUILD_PUSH_STATUSES: ILabelMapper<BuildPushResult['status']> = {
  SUCCESS: {
    text: 'SUCCESS',
    color: 'green',
  },
  ACCEPTED: {
    text: 'ACCEPTED',
    color: 'blue',
  },
  REJECTED: {
    text: 'REJECTED',
    color: 'red',
  },
  FAILED: {
    text: 'FAILED',
    color: 'red',
  },
  SYSTEM_ERROR: {
    text: 'SYSTEM ERROR',
    color: 'red',
  },
  CANCELED: {
    text: 'CANCELLED',
    color: 'grey',
  },
};

interface IBuildPushStatusLabelMapperProps {
  status: BuildPushResult['status'];
}

export const BuildPushStatusLabelMapper = ({ status }: IBuildPushStatusLabelMapperProps) => (
  <LabelMapper mapperItem={BUILD_PUSH_STATUSES[status]} />
);
