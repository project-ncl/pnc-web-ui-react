import { Form, FormGroup, Switch } from '@patternfly/react-core';

import { ProductMilestone } from 'pnc-api-types-ts';

import { productMilestoneCloseRequestEntityAttributes } from 'common/productMilestoneCloseRequestEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';

const fieldConfigs = {
  skipBrewPush: {
    value: false,
  },
} satisfies IFieldConfigs;

export interface IProductMilestoneCloseModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone: ProductMilestone;
}

export const ProductMilestoneCloseModal = ({ isModalOpen, toggleModal, productMilestone }: IProductMilestoneCloseModalProps) => {
  const serviceContainerProductMilestoneClose = useServiceContainer(productMilestoneApi.closeProductMilestone, 0);

  const { register, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerProductMilestoneClose.run({
      serviceData: { id: productMilestone.id, data: { skipBrewPush: data.skipBrewPush } },
      onError: () => console.error('Failed to close Product Milestone.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`Close Milestone ${productMilestone.version}?`}
      actionTitle="Close Milestone"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerProductMilestoneClose}
      modalVariant="large"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          label={productMilestoneCloseRequestEntityAttributes.skipBrewPush.title}
          fieldId={productMilestoneCloseRequestEntityAttributes.skipBrewPush.id}
          labelIcon={<TooltipWrapper tooltip={productMilestoneCloseRequestEntityAttributes.skipBrewPush.tooltip} />}
        >
          <FormInput<boolean>
            {...register<boolean>(productMilestoneCloseRequestEntityAttributes.skipBrewPush.id, fieldConfigs.skipBrewPush)}
            render={({ value, ...rest }) => (
              <Switch
                id={productMilestoneCloseRequestEntityAttributes.skipBrewPush.id}
                name={productMilestoneCloseRequestEntityAttributes.skipBrewPush.id}
                label="Enabled"
                labelOff="Disabled"
                isChecked={value}
                {...rest}
              />
            )}
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
