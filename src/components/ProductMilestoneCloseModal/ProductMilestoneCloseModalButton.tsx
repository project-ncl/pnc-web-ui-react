import { css } from '@patternfly/react-styles';

import { ProductMilestone } from 'pnc-api-types-ts';

import { ProtectedButton } from 'components/Button/Button';

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
    <ProtectedButton
      variant={isListVariant ? 'plain' : 'secondary'}
      onClick={toggleModal}
      isDisabled={!!disabledButtonReason}
      className={css(isListVariant && 'full-width b-radius-0')}
      size={isListVariant ? 'default' : 'sm'}
      tooltip={disabledButtonReason}
    >
      Close Milestone
    </ProtectedButton>
  );
};
