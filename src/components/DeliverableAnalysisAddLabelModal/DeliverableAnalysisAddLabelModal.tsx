import { Form, FormGroup, TextArea } from '@patternfly/react-core';
import { useState } from 'react';

import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { ButtonTitles } from 'common/constants';
import {
  deliverableAnalysisLabelEntryEntityAttributes,
  deliverableAnalysisLabels,
} from 'common/deliverableAnalysisLabelEntryEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { Select } from 'components/Select/Select';
import { SelectOption } from 'components/Select/SelectOption';

import * as deliverableAnalysisApi from 'services/deliverableAnalysisApi';

import { maxLengthValidator } from 'utils/formValidationHelpers';

const fieldConfigs = {
  label: {
    isRequired: true,
  },
  reason: {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

interface IDeliverableAnalysisAddLabelModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  deliverableAnalysisReport: DeliverableAnalyzerReport;
}

export const DeliverableAnalysisAddLabelModal = ({
  isModalOpen,
  toggleModal,
  deliverableAnalysisReport,
}: IDeliverableAnalysisAddLabelModalProps) => {
  const serviceContainerDeliverableAnalysisAddLabel = useServiceContainer(deliverableAnalysisApi.addDeliverableAnalysisLabel, 0);

  const [isLabelSelectOpen, setIsLabelSelectOpen] = useState<boolean>(false);

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerDeliverableAnalysisAddLabel.run({
      serviceData: {
        id: deliverableAnalysisReport.id!,
        data: { label: data.label, reason: data.reason },
      },
      onError: () => console.error('Failed to add Deliverable Analysis Label.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`${ButtonTitles.add} Deliverable Analysis Label: ${deliverableAnalysisReport.id}`}
      actionTitle={ButtonTitles.add}
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerDeliverableAnalysisAddLabel}
      modalVariant="large"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={deliverableAnalysisLabelEntryEntityAttributes.label.title}
          fieldId={deliverableAnalysisLabelEntryEntityAttributes.label.id}
        >
          <Select
            id={deliverableAnalysisLabelEntryEntityAttributes.label.id}
            isOpen={isLabelSelectOpen}
            onToggle={setIsLabelSelectOpen}
            placeholder="Select Label"
            {...register<string>(deliverableAnalysisLabelEntryEntityAttributes.label.id, fieldConfigs.label)}
          >
            {deliverableAnalysisLabels.map((label) => (
              <SelectOption
                key={label.value}
                option={label.value}
                description={label.description}
                isDisabled={label.value === 'SCRATCH'}
              />
            ))}
          </Select>
          <FormInputHelperText variant="error">
            {getFieldErrors(deliverableAnalysisLabelEntryEntityAttributes.label.id)}
          </FormInputHelperText>
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
