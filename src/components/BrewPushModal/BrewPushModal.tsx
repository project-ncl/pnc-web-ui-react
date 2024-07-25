import { Button, Form, FormGroup, TextInput } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { buildPushParametersEntityAttributes } from 'common/buildPushParametersEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildApi from 'services/buildApi';
import * as groupBuildApi from 'services/groupBuildApi';

const fieldConfigs = {
  tagPrefix: {
    isRequired: true,
  },
} satisfies IFieldConfigs;

export interface IBrewPushModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  build: Build | GroupBuild;
  variant: 'Build' | 'Group Build';
}

export const BrewPushModal = ({ isModalOpen, toggleModal, build, variant }: IBrewPushModalProps) => {
  const serviceContainerPushToBrew = useServiceContainer(variant === 'Build' ? buildApi.pushToBrew : groupBuildApi.pushToBrew, 0);

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerPushToBrew.run({
      serviceData: {
        id: build.id,
        data: { tagPrefix: data.tagPrefix },
      },
      onError: () => console.error('Failed to push to Brew.'),
    });
  };

  return (
    <ActionModal
      modalTitle="Push to Brew"
      actionTitle="Push to Brew"
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerPushToBrew}
      modalVariant="large"
      refreshOnClose={false}
      onSuccessActions={
        variant === 'Build'
          ? [
              <Button
                key="brew-push-link"
                variant="secondary"
                onClick={toggleModal}
                component={(props: any) => <Link {...props} to={`/builds/${build.id}/brew-push`} />}
              >
                Open Brew Push details
              </Button>,
            ]
          : undefined
      }
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={buildPushParametersEntityAttributes.tagPrefix.title}
          fieldId={buildPushParametersEntityAttributes.tagPrefix.id}
          labelIcon={<TooltipWrapper tooltip={buildPushParametersEntityAttributes.tagPrefix.tooltip} />}
        >
          <TextInput
            isRequired
            type="text"
            id={buildPushParametersEntityAttributes.tagPrefix.id}
            name={buildPushParametersEntityAttributes.tagPrefix.id}
            autoComplete="off"
            {...register<string>(buildPushParametersEntityAttributes.tagPrefix.id, fieldConfigs.tagPrefix)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(buildPushParametersEntityAttributes.tagPrefix.id)}
          </FormInputHelperText>
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
