import { Label } from '@patternfly/react-core';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { ILabelMapper } from 'components/ArtifactQualityLabel/ArtifactQualityLabel';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';

const CLOSE_STATUSES: ILabelMapper = {
  IN_PROGRESS: {
    text: 'IN PROGRESS',
    color: 'blue',
  },
  FAILED: {
    text: 'FAILED',
    color: 'red',
  },
  SUCCEEDED: {
    text: 'SUCCEEDED',
    color: 'green',
  },
  CANCELED: {
    text: 'CANCELLED',
    color: 'grey',
  },
  SYSTEM_ERROR: {
    text: 'SYSTEM ERROR',
    color: 'red',
  },
};

interface IProductMilestoneCloseStatusLabelProps {
  status: ProductMilestoneCloseResult['status'];
}

export const ProductMilestoneCloseStatusLabel = ({ status }: IProductMilestoneCloseStatusLabelProps) => {
  const closeStatus = CLOSE_STATUSES[status];

  return closeStatus ? <Label color={closeStatus.color}>{closeStatus.text}</Label> : <EmptyStateSymbol />;
};
