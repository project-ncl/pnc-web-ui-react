import { Button, Form, FormGroup, Switch, TextInput } from '@patternfly/react-core';
import { useMemo } from 'react';
import { Link } from 'react-router';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { buildPushParametersEntityAttributes } from 'common/buildPushParametersEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildApi from 'services/buildApi';
import * as groupBuildApi from 'services/groupBuildApi';

const fieldConfigs = {
  tagPrefix: {
    isRequired: true,
  },
  reimport: {
    value: false,
  },
} satisfies IFieldConfigs;

export interface IBrewPushModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  build: Build | GroupBuild;
  variant: 'Build' | 'Group Build';
}

export const BrewPushModal = ({ isModalOpen, toggleModal, build, variant }: IBrewPushModalProps) => {
  const isSingleBuildPush = useMemo(() => variant === 'Build', [variant]);

  const serviceContainerPushToBrew = useServiceContainer(isSingleBuildPush ? buildApi.pushToBrew : groupBuildApi.pushToBrew, 0);

  const { register, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerPushToBrew.run({
      serviceData: {
        id: build.id,
        data: { tagPrefix: data.tagPrefix, reimport: isSingleBuildPush ? data.reimport : undefined },
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
        <FormGroup
          label={buildPushParametersEntityAttributes.reimport.title}
          fieldId={buildPushParametersEntityAttributes.reimport.id}
          labelIcon={<TooltipWrapper tooltip={buildPushParametersEntityAttributes.reimport.tooltip} />}
        >
          <FormInput<boolean>
            {...register<boolean>(buildPushParametersEntityAttributes.reimport.id, fieldConfigs.reimport)}
            render={({ value, ...rest }) => (
              <TooltipWrapper tooltip={!isSingleBuildPush && 'Group Build pushes cannot use this option.'}>
                <Switch
                  id={buildPushParametersEntityAttributes.reimport.id}
                  name={buildPushParametersEntityAttributes.reimport.id}
                  label="Enabled"
                  labelOff="Disabled"
                  isChecked={isSingleBuildPush && value}
                  isDisabled={!isSingleBuildPush}
                  {...rest}
                />
              </TooltipWrapper>
            )}
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
