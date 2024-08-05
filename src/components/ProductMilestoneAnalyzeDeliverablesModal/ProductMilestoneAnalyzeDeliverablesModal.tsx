import { Button, Form, FormGroup, Switch, TextArea } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

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
          deliverablesUrls: data.deliverablesUrls?.split(/\s+/),
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
            <Link {...props} to={`deliverables-analysis/${serviceContainerProductMilestoneAnalyzeDeliverables.data?.id}`} />
          )}
        >
          Open Deliverables Analysis details
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
          label={productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.title}
          fieldId={productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.id}
        >
          <TextArea
            isRequired
            type="text"
            id={productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.id}
            name={productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.id}
            resizeOrientation="vertical"
            autoResize
            autoComplete="off"
            placeholder={`https://url-path/to/file1.zip
https://url-path/to/file2.zip
https://url-path/to/file3.zip`}
            {...register<string>(
              productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.id,
              fieldConfigs.deliverablesUrls
            )}
          />

          <FormInputHelperText variant="error">
            {getFieldErrors(productMilestoneDeliverablesAnalysisEntityAttributes.deliverablesUrls.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          label={productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.title}
          fieldId={productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
          labelIcon={
            <TooltipWrapper tooltip={productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.tooltip} />
          }
        >
          <FormInput<boolean>
            {...register<boolean>(
              productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id,
              fieldConfigs.runAsScratchAnalysis
            )}
            render={({ value, onChange, onBlur }) => (
              <Switch
                id={productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
                name={productMilestoneDeliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
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
