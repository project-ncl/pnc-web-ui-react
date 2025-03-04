import { Button, Form, FormGroup, Switch, TextArea } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { validateUrls } from 'utils/formValidationHelpers';

const fieldConfigs = {
  deliverablesUrls: {
    isRequired: true,
    validators: [{ validator: validateUrls, errorMessage: 'Invalid format of URLs.' }],
  },
  runAsScratchAnalysis: {
    value: false,
  },
} satisfies IFieldConfigs;

interface IProductMilestoneAnalyzeDeliverablesModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone: ProductMilestone;
}

export const ProductMilestoneAnalyzeDeliverablesModal = ({
  isModalOpen,
  toggleModal,
  productMilestone,
}: IProductMilestoneAnalyzeDeliverablesModalProps) => {
  const serviceContainerProductMilestoneAnalyzeDeliverables = useServiceContainer(productMilestoneApi.analyzeDeliverables, 0);

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerProductMilestoneAnalyzeDeliverables.run({
      serviceData: {
        id: productMilestone.id,
        data: {
          deliverablesUrls: data.deliverablesUrls?.split(/\s+/).filter((url: string) => url.length > 0),
          runAsScratchAnalysis: data.runAsScratchAnalysis,
        },
      },
      onError: () => console.error('Failed to analyze Deliverables.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`Analyze Deliverables: ${productMilestone.version}?`}
      actionTitle="Analyze Deliverables"
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerProductMilestoneAnalyzeDeliverables}
      modalVariant="large"
      refreshOnClose={false}
      onSuccessActions={[
        <Button
          key="del-analysis-link"
          variant="secondary"
          // TODO: Make link absolute once Product data are available
          component={(props: any) => (
            <Link {...props} to={`deliverable-analyses/${serviceContainerProductMilestoneAnalyzeDeliverables.data?.id}`} />
          )}
        >
          Open Deliverable Analysis details
        </Button>,
      ]}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={deliverableAnalysisOperationEntityAttributes.deliverablesUrls.title}
          fieldId={deliverableAnalysisOperationEntityAttributes.deliverablesUrls.id}
        >
          <TextArea
            isRequired
            type="text"
            id={deliverableAnalysisOperationEntityAttributes.deliverablesUrls.id}
            name={deliverableAnalysisOperationEntityAttributes.deliverablesUrls.id}
            resizeOrientation="vertical"
            autoResize
            autoComplete="off"
            placeholder={`https://url-path/to/file1.zip
https://url-path/to/file2.zip
https://url-path/to/file3.zip`}
            {...register<string>(deliverableAnalysisOperationEntityAttributes.deliverablesUrls.id, fieldConfigs.deliverablesUrls)}
          />

          <FormInputHelperText variant="error">
            {getFieldErrors(deliverableAnalysisOperationEntityAttributes.deliverablesUrls.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          label={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.title}
          fieldId={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id}
          labelIcon={<TooltipWrapper tooltip={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.tooltip} />}
        >
          <FormInput<boolean>
            {...register<boolean>(
              deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id,
              fieldConfigs.runAsScratchAnalysis
            )}
            render={({ value, onChange, onBlur }) => (
              <Switch
                id={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id}
                name={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id}
                label="Enabled"
                labelOff="Disabled"
                isChecked={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
