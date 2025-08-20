import { css } from '@patternfly/react-styles';

import { ProductMilestone, ProductVersion } from 'pnc-api-types-ts';

import { DataValues, IServiceContainerState } from 'hooks/useServiceContainer';

import { ProtectedButton } from 'components/Button/Button';
import { IProductMilestoneMarkModalProps } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface IProductMilestoneMarkModalButtonProps {
  toggleModal: () => void;
  productMilestone: ProductMilestone;
  serviceContainerProductVersion: IServiceContainerState<ProductVersion>;
  variant: IProductMilestoneMarkModalProps['variant'];
}

export const ProductMilestoneMarkModalButton = ({
  toggleModal,
  productMilestone,
  serviceContainerProductVersion,
  variant,
}: IProductMilestoneMarkModalButtonProps) => {
  const disabledButtonReason = !!productMilestone.endDate
    ? 'Milestone is already closed.'
    : productMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id
    ? 'Milestone is already marked as current.'
    : '';

  const isDisabled =
    serviceContainerProductVersion.data === DataValues.notYetData ||
    !!serviceContainerProductVersion.error ||
    !!disabledButtonReason;

  const isListVariant = variant === 'list';

  return (
    <>
      {/* TODO: progress button - NCL-8010 */}
      <ProtectedButton
        variant={isListVariant ? 'plain' : 'secondary'}
        onClick={toggleModal}
        isDisabled={isDisabled}
        className={css(isListVariant && 'full-width b-radius-0')}
        size={isListVariant ? 'default' : 'sm'}
        tooltip={disabledButtonReason}
      >
        <ServiceContainerLoading {...serviceContainerProductVersion} variant="icon" title="Product Version" /> Mark as current
      </ProtectedButton>
    </>
  );
};
