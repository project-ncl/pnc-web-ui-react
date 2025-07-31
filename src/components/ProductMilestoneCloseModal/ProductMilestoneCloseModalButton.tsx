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

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button
          variant={variant === 'list' ? 'plain' : 'tertiary'}
          onClick={toggleModal}
          isAriaDisabled={!!disabledButtonReason}
          className={css(
            variant === 'list' && !!disabledButtonReason && 'disabled-color',
            'dropdown-item-font-size',
            'text-align-left'
          )}
          isBlock
          size="sm"
        >
          Close Milestone
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
