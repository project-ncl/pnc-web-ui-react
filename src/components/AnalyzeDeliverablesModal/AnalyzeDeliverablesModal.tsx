import { Button, Form, FormGroup, FormHelperText, Switch, TextArea } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { deliverablesAnalysisEntityAttributes } from 'common/deliverablesAnalysisEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as operationsApi from 'services/operationsApi';
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

interface IAnalyzeDeliverablesModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  productMilestone?: ProductMilestone;
}

export const AnalyzeDeliverablesModal = ({ isModalOpen, toggleModal, productMilestone }: IAnalyzeDeliverablesModalProps) => {
  const serviceContainerAnalyzeDeliverables = useServiceContainer(
    productMilestone ? productMilestoneApi.analyzeDeliverables : operationsApi.analyzeDeliverables,
    0
  );

  const { register, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    const serviceData = productMilestone
      ? {
          id: productMilestone.id,
          data: {
            deliverablesUrls: data.deliverablesUrls?.split(/\s+/),
            runAsScratchAnalysis: data.runAsScratchAnalysis,
          },
        }
      : {
          data: {
            deliverablesUrls: data.deliverablesUrls?.split(/\s+/),
          },
        };

    return serviceContainerAnalyzeDeliverables.run({ serviceData: serviceData as any }).catch((error) => {
      console.error('Failed to analyze Deliverables.');
      throw error;
    });
  };

  return (
    <ActionModal
      modalTitle={'Analyze Deliverables' + (productMilestone ? `: ${productMilestone.version}?` : '?')}
      actionTitle="Analyze Deliverables"
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerAnalyzeDeliverables}
      modalVariant="large"
      onSuccessActions={[
        <Button
          variant="secondary"
          // TODO: Make link absolute once Product data are available
          component={
            productMilestone
              ? (props: any) => <Link {...props} to={`deliverables-analysis/${serviceContainerAnalyzeDeliverables.data?.id}`} />
              : undefined
          }
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
                isChecked={productMilestone ? value : true}
                onChange={onChange}
                onBlur={onBlur}
                isDisabled={!productMilestone}
              />
            )}
          />

          <FormHelperText isHidden={!!productMilestone}>Milestone-less analyses run as scratch.</FormHelperText>
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
