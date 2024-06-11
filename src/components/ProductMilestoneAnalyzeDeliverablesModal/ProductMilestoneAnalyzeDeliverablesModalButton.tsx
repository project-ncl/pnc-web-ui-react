import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IProductMilestoneAnalyzeDeliverablesModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const ProductMilestoneAnalyzeDeliverablesModalButton = ({
  toggleModal,
  variant,
}: IProductMilestoneAnalyzeDeliverablesModalButtonProps) => (
  <ProtectedComponent>
    <Button
      variant={variant === 'list' ? 'plain' : 'tertiary'}
      onClick={toggleModal}
      className={css(variant === 'list' && 'black-color', 'dropdown-item-font-size', 'text-align-left')}
      isBlock
      size="sm"
    >
      Analyze Deliverables
    </Button>
  </ProtectedComponent>
);
