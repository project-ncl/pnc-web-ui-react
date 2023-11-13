import { Button, Form, FormGroup, FormHelperText, Switch, TextArea } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { deliverablesAnalysisEntityAttributes } from 'common/deliverablesAnalysisEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
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

  const { register, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerProductMilestoneAnalyzeDeliverables
      .run({
        serviceData: {
          id: productMilestone.id,
          data: {
            deliverablesUrls: data.deliverablesUrls?.split(/\s+/),
            runAsScratchAnalysis: data.runAsScratchAnalysis,
          },
        },
      })
      .catch((error) => {
        console.error('Failed to analyze Deliverables.');
        throw error;
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
      onSuccessActions={[
        <Button
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
          label={deliverablesAnalysisEntityAttributes.deliverablesUrls.title}
          fieldId={deliverablesAnalysisEntityAttributes.deliverablesUrls.id}
          helperText={
            <FormHelperText
              isHidden={getFieldState(deliverablesAnalysisEntityAttributes.deliverablesUrls.id) !== 'error'}
              isError
            >
              {getFieldErrors(deliverablesAnalysisEntityAttributes.deliverablesUrls.id)}
            </FormHelperText>
          }
        >
          <TextArea
            isRequired
            type="text"
            id={deliverablesAnalysisEntityAttributes.deliverablesUrls.id}
            name={deliverablesAnalysisEntityAttributes.deliverablesUrls.id}
            resizeOrientation="vertical"
            autoResize
            autoComplete="off"
            placeholder={`https://url-path/to/file1.zip
https://url-path/to/file2.zip
https://url-path/to/file3.zip`}
            {...register<string>(deliverablesAnalysisEntityAttributes.deliverablesUrls.id, fieldConfigs.deliverablesUrls)}
          />
        </FormGroup>
        <FormGroup
          label={deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.title}
          fieldId={deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
          labelIcon={<TooltipWrapper tooltip={deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.tooltip} />}
        >
          <FormInput<boolean>
            {...register<boolean>(
              deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id,
              fieldConfigs.runAsScratchAnalysis
            )}
            render={({ value, onChange, onBlur }) => (
              <Switch
                id={deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
                name={deliverablesAnalysisEntityAttributes.runAsScratchAnalysis.id}
                label="Scratch Option Enabled"
                labelOff="Scratch Option Disabled"
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
