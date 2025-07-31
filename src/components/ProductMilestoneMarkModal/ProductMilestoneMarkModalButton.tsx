import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProductMilestone, ProductVersion } from 'pnc-api-types-ts';

import { DataValues, IServiceContainerState } from 'hooks/useServiceContainer';

import { IProductMilestoneMarkModalProps } from 'components/ProductMilestoneMarkModal/ProductMilestoneMarkModal';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

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
      <ProtectedComponent>
        <TooltipWrapper tooltip={disabledButtonReason}>
          {/* TODO: progress button - NCL-8010 */}
          <Button
            variant={isListVariant ? 'plain' : 'tertiary'}
            onClick={toggleModal}
            isAriaDisabled={isDisabled}
            className={css(isListVariant && 'full-width b-radius-0')}
            size={!isListVariant ? 'sm' : 'default'}
          >
            <ServiceContainerLoading {...serviceContainerProductVersion} variant="icon" title="Product Version" /> Mark as current
          </Button>
        </TooltipWrapper>
      </ProtectedComponent>
    </>
  );
};
