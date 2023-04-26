import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { ILabelMapper, Label } from 'components/Label/Label';

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
  return <Label labelObject={CLOSE_STATUSES[status]}></Label>;
};
