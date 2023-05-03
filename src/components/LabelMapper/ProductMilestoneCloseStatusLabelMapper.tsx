import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const CLOSE_STATUSES: ILabelMapper<ProductMilestoneCloseResult['status']> = {
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

export const ProductMilestoneCloseStatusLabelMapper = ({ status }: IProductMilestoneCloseStatusLabelProps) => (
  <LabelMapper mapper={CLOSE_STATUSES[status]} />
);
