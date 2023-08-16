import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IProductMilestoneCloseModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const ProductMilestoneCloseModalButton = ({ toggleModal, variant }: IProductMilestoneCloseModalButtonProps) => (
  <ProtectedComponent disable>
    <Button
      variant={variant === 'list' ? 'plain' : 'tertiary'}
      onClick={toggleModal}
      className={css(variant === 'list' && 'black-color', 'text-align-left')}
      isBlock
      isSmall
    >
      Close Milestone
    </Button>
  </ProtectedComponent>
);
