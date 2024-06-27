import { Button, Form, FormGroup, TextArea } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Artifact, Build } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { artifactQualityRevisionEntityAttributes } from 'common/artifactQualityRevisionEntityAttributes';
import { ButtonTitles } from 'common/constants';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { Select } from 'components/Select/Select';
import { SelectOption } from 'components/Select/SelectOption';

import * as artifactApi from 'services/artifactApi';
import * as buildApi from 'services/buildApi';

import { maxLengthValidator } from 'utils/formValidationHelpers';

const fieldConfigs = {
  artifactQuality: {
    isRequired: true,
  },
  qualityLevelReason: {
    isRequired: true,
    validators: [maxLengthValidator(200)],
  },
} satisfies IFieldConfigs;

export type IArtifactEditQualityModalProps = {
  isModalOpen: boolean;
  toggleModal: () => void;
  variant: 'detail' | 'list';
} & ({ artifact: Artifact } | { build: Build });

export const ArtifactEditQualityModal = ({ isModalOpen, toggleModal, variant, ...rest }: IArtifactEditQualityModalProps) => {
  const artifact = 'artifact' in rest ? rest.artifact : undefined;
  const build = 'build' in rest ? rest.build : undefined;

  const serviceContainerArtifactEditQualityArtifact = useServiceContainer(artifactApi.editArtifactQuality, 0);
  const serviceContainerArtifactEditQualityBuild = useServiceContainer(buildApi.editArtifactsQuality, 0);
  const serviceContainerArtifactEditQuality = build
    ? serviceContainerArtifactEditQualityBuild
    : serviceContainerArtifactEditQualityArtifact;

  const [isQualitySelectOpen, setIsQualitySelectOpen] = useState<boolean>(false);

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const confirmModal = (data: IFieldValues) => {
    return serviceContainerArtifactEditQuality
      .run({
        serviceData: {
          id: build?.id ?? artifact!.id,
        },
        requestConfig: {
          params: {
            quality: data.artifactQuality,
            reason: data.qualityLevelReason,
          },
        },
      })
      .catch((error) => {
        console.error('Failed to edit Artifact Quality.');
        throw error;
      });
  };

  useEffect(() => {
    artifact?.artifactQuality &&
      setFieldValues({
        artifactQuality: artifact.artifactQuality,
      });
  }, [setFieldValues, artifact?.artifactQuality]);

  return (
    <ActionModal
      modalTitle={
        build
          ? `${ButtonTitles.edit} All Artifact Qualities: #${build.id}`
          : `${ButtonTitles.edit} Artifact Quality: ${artifact!.identifier}`
      }
      actionTitle={ButtonTitles.update}
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerArtifactEditQuality}
      modalVariant="large"
      onSuccessActions={
        variant === 'list' && artifact
          ? [
              <Button variant="secondary" component={(props: any) => <Link {...props} to={`/artifacts/${artifact.id}`} />}>
                Go to the detail page
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
          label={artifactQualityRevisionEntityAttributes.artifactQuality.title}
          fieldId={artifactQualityRevisionEntityAttributes.artifactQuality.id}
        >
          <Select
            id={artifactQualityRevisionEntityAttributes.artifactQuality.id}
            isOpen={isQualitySelectOpen}
            onToggle={setIsQualitySelectOpen}
            placeholder="Select Artifact Quality"
            {...register<string>(artifactQualityRevisionEntityAttributes.artifactQuality.id, fieldConfigs.artifactQuality)}
          >
            {artifactEntityAttributes.artifactQuality.values.map((quality) => (
              <SelectOption key={quality} option={quality} />
            ))}
          </Select>
          <FormInputHelperText variant="error">
            {getFieldErrors(artifactQualityRevisionEntityAttributes.artifactQuality.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          isRequired
          label={artifactQualityRevisionEntityAttributes.qualityLevelReason.title}
          fieldId={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
        >
          <TextArea
            isRequired
            type="text"
            id={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            name={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            resizeOrientation="vertical"
            autoComplete="off"
            {...register<string>(artifactQualityRevisionEntityAttributes.qualityLevelReason.id, fieldConfigs.qualityLevelReason)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(artifactQualityRevisionEntityAttributes.qualityLevelReason.id)}
          </FormInputHelperText>
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
