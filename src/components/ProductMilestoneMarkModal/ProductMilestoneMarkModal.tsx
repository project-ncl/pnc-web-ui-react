import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone, ProductVersion } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as productVersionApi from 'services/productVersionApi';

import { createSafePatch } from 'utils/patchHelper';

export interface IProductMilestoneMarkModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone: ProductMilestone;
  productVersion: ProductVersion;
  variant: 'detail' | 'list';
}

export const ProductMilestoneMarkModal = ({
  isModalOpen,
  toggleModal,
  productMilestone,
  productVersion,
  variant,
}: IProductMilestoneMarkModalProps) => {
  const serviceContainerProductVersionPatch = useServiceContainer(productVersionApi.patchProductVersion, 0);

  const confirmModal = () => {
    const patchData = createSafePatch(productVersion, {
      currentProductMilestone: { id: productMilestone.id },
    });

    serviceContainerProductVersionPatch.run({ serviceData: { id: productVersion.id, patchData } }).catch(() => {
      console.error('Failed to edit current Product Milestone.');
    });
  };

  return (
    <ActionModal
      modalTitle={`Mark Milestone ${productMilestone.version} as current?`}
      actionTitle="Mark Milestone as current"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerProductVersionPatch}
      modalVariant="medium"
      onSuccessActions={
        variant === 'list'
          ? [
              <Button
                variant="secondary"
                component={(props) => (
                  <Link
                    {...props}
                    to={`/products/${productVersion.product?.id}/versions/${productVersion.id}/milestones/${productMilestone.id}`}
                  />
                )}
              >
                Go to the detail page
              </Button>,
            ]
          : undefined
      }
    >
      Product Milestone <b>{productMilestone.version}</b> will be marked as current in its Product Version. Formerly current
      Product Milestone will no longer be current.
    </ActionModal>
  );
};
