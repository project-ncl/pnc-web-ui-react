import { ProductMilestone } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as productMilestoneApi from 'services/productMilestoneApi';

export interface IProductMilestoneCloseModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone: ProductMilestone;
}

export const ProductMilestoneCloseModal = ({ isModalOpen, toggleModal, productMilestone }: IProductMilestoneCloseModalProps) => {
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
    >
      Product Milestone <b>{productMilestone.version}</b> will be closed.
    </ActionModal>
  );
};
