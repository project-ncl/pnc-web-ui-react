import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as productMilestoneApi from 'services/productMilestoneApi';

export interface IProductMilestoneCloseModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone: ProductMilestone;
}

export const ProductMilestoneCloseModal = ({ isModalOpen, toggleModal, productMilestone }: IProductMilestoneCloseModalProps) => {
  const { productId, productVersionId } = useParamsRequired();

  const serviceContainerProductMilestoneClose = useServiceContainer(productMilestoneApi.closeProductMilestone, 0);

  const confirmModal = () => {
    return serviceContainerProductMilestoneClose.run({
      serviceData: { id: productMilestone.id },
      onError: () => console.error('Failed to close Product Milestone.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`Close Milestone ${productMilestone.version}?`}
      actionTitle="Close Milestone"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerProductMilestoneClose}
      modalVariant="medium"
      refreshOnClose={false}
      onSuccessActions={[
        <Button
          key="close-result-link"
          variant="secondary"
          // TODO: Use props from Milestone DTO once Product data are available
          component={(props) => (
            <Link
              {...props}
              to={`/products/${productId}/versions/${productVersionId}/milestones/${productMilestone.id}/close-results/${serviceContainerProductMilestoneClose.data?.id}`}
            />
          )}
        >
          Open Close Result
        </Button>,
      ]}
    >
      Product Milestone <b>{productMilestone.version}</b> will be closed.
    </ActionModal>
  );
};
