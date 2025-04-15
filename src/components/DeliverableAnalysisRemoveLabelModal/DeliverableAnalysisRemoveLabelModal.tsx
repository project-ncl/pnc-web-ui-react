import { Form, FormGroup, TextArea } from '@patternfly/react-core';

import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { ButtonTitles } from 'common/constants';
import {
  DeliverableAnalysisLabel,
  deliverableAnalysisLabelEntryEntityAttributes,
} from 'common/deliverableAnalysisLabelEntryEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { DeliverableAnalysisLabelLabelMapper } from 'components/LabelMapper/DeliverableAnalysisLabelLabelMapper';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';

import { maxLengthValidator } from 'utils/formValidationHelpers';

const fieldConfigs = {
  reason: {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

interface IDeliverableAnalysisRemoveLabelModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  deliverableAnalysisReport: DeliverableAnalyzerReport;
  label: DeliverableAnalysisLabel;
}

export const DeliverableAnalysisRemoveLabelModal = ({
  isModalOpen,
  toggleModal,
  deliverableAnalysisReport,
  label,
}: IDeliverableAnalysisRemoveLabelModalProps) => {
  const serviceContainerDeliverableAnalysisRemoveLabel = useServiceContainer(
    deliverableAnalysisApi.removeDeliverableAnalysisLabel,
    0
  );

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerDeliverableAnalysisRemoveLabel.run({
      serviceData: {
        id: deliverableAnalysisReport.id!,
        data: { label: label, reason: data.reason },
      },
      onError: () => console.error('Failed to remove Deliverable Analysis Label.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`${ButtonTitles.remove} Deliverable Analysis Label: ${deliverableAnalysisReport.id}`}
      actionTitle={ButtonTitles.remove}
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerDeliverableAnalysisRemoveLabel}
      modalVariant="large"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          label={deliverableAnalysisLabelEntryEntityAttributes.label.title}
          fieldId={deliverableAnalysisLabelEntryEntityAttributes.label.id}
        >
          <DeliverableAnalysisLabelLabelMapper label={label} />
        </FormGroup>
        <FormGroup
          isRequired
          label={deliverableAnalysisLabelEntryEntityAttributes.reason.title}
          fieldId={deliverableAnalysisLabelEntryEntityAttributes.reason.id}
        >
          <TextArea
            isRequired
            type="text"
            id={deliverableAnalysisLabelEntryEntityAttributes.reason.id}
            name={deliverableAnalysisLabelEntryEntityAttributes.reason.id}
            resizeOrientation="vertical"
            autoComplete="off"
            {...register<string>(deliverableAnalysisLabelEntryEntityAttributes.reason.id, fieldConfigs.reason)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(deliverableAnalysisLabelEntryEntityAttributes.reason.id)}
          </FormInputHelperText>
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
