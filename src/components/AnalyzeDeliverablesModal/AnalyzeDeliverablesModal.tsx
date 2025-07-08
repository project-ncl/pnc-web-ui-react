import { Button, Form, FormGroup, Switch, TextArea } from '@patternfly/react-core';
import { Link } from 'react-router';

import { ProductMilestone } from 'pnc-api-types-ts';

import { deliverableAnalysisOperationEntityAttributes } from 'common/deliverableAnalysisOperationEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as operationsApi from 'services/operationsApi';

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

const actionTitle = 'Analyze Deliverables';

interface IAnalyzeDeliverablesModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone?: ProductMilestone;
}

export const AnalyzeDeliverablesModal = ({ isModalOpen, toggleModal, productMilestone }: IAnalyzeDeliverablesModalProps) => {
  const serviceContainerAnalyzeDeliverables = useServiceContainer(operationsApi.analyzeDeliverables, 0);

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerAnalyzeDeliverables.run({
      serviceData: {
        id: productMilestone?.id,
        data: {
          deliverablesUrls: data.deliverablesUrls?.split(/\s+/).filter((url: string) => url.length > 0),
          runAsScratchAnalysis: productMilestone ? data.runAsScratchAnalysis : undefined,
        },
      },
      onError: () => console.error('Failed to analyze Deliverables.'),
    });
  };

  return (
    <ActionModal
      modalTitle={productMilestone ? `${actionTitle}: ${productMilestone.version}?` : `${actionTitle}?`}
      actionTitle={actionTitle}
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerAnalyzeDeliverables}
      modalVariant="large"
      refreshOnClose={false}
      onSuccessActions={[
        <Button
          key="del-analysis-link"
          variant="secondary"
          // TODO: Make link absolute once Product data are available
          component={(props: any) => (
            <Link {...props} to={`/deliverable-analyses/${serviceContainerAnalyzeDeliverables.data?.id}`} />
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
          labelHelp={<TooltipWrapper tooltip={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.tooltip} />}
        >
          <FormInput<boolean>
            {...register<boolean>(
              deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id,
              fieldConfigs.runAsScratchAnalysis
            )}
            render={({ value, onChange, onBlur }) => (
              <TooltipWrapper tooltip={!productMilestone && 'All Milestone-less Analyses are marked as scratch.'}>
                <Switch
                  id={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id}
                  name={deliverableAnalysisOperationEntityAttributes.runAsScratchAnalysis.id}
                  label="Enabled"
                  isChecked={!productMilestone || value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isDisabled={!productMilestone}
                />
              </TooltipWrapper>
            )}
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
