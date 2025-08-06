import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProductMilestone } from 'pnc-api-types-ts';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IProductMilestoneCloseModalButtonProps {
  toggleModal: () => void;
  productMilestone: ProductMilestone;
  variant: 'detail' | 'list';
}

export const ProductMilestoneCloseModalButton = ({
  toggleModal,
  productMilestone,
  variant,
}: IProductMilestoneCloseModalButtonProps) => {
  const disabledButtonReason = !!productMilestone.endDate ? 'Milestone is already closed.' : '';

  const isListVariant = variant === 'list';

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button
          variant={isListVariant ? 'plain' : 'secondary'}
          onClick={toggleModal}
          isAriaDisabled={!!disabledButtonReason}
          className={css(isListVariant && 'full-width b-radius-0')}
          size={isListVariant ? 'default' : 'sm'}
        >
          Close Milestone
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
