import { Button, Form, FormGroup, FormHelperText, Select, SelectOption, TextArea } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { artifactQualityRevisionEntityAttributes } from 'common/artifactQualityRevisionEntityAttributes';

import { IFieldValues, useNewForm } from 'hooks/useNewForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { FormInput } from 'components/FormInput/FormInput';

import * as artifactApi from 'services/artifactApi';

const formConfig = {
  artifactQuality: {
    isRequired: true,
  },
  qualityLevelReason: {
    isRequired: true,
  },
};

export interface IArtifactEditQualityModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  artifact: Artifact;
  variant: 'detail' | 'list';
}

export const ArtifactEditQualityModal = ({ isModalOpen, toggleModal, artifact, variant }: IArtifactEditQualityModalProps) => {
  const serviceContainerArtifactEditQuality = useServiceContainer(artifactApi.editArtifactQuality, 0);

  const [isQualitySelectOpen, setIsQualitySelectOpen] = useState<boolean>(false);

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } =
    useNewForm();

  const confirmModal = (data: IFieldValues) => {
    serviceContainerArtifactEditQuality
      .run({
        serviceData: {
          id: artifact.id,
        },
        requestConfig: {
          params: {
            quality: data.artifactQuality,
            reason: data.qualityLevelReason,
          },
        },
      })
      .catch(() => {
        console.error('Failed to edit Artifact Quality.');
      });
  };

  useEffect(() => {
    setFieldValues({
      artifactQuality: artifact.artifactQuality,
    });
  }, [setFieldValues, artifact.artifactQuality]);

  return (
    <ActionModal
      modalTitle={`Edit Artifact Quality: ${artifact.identifier}`}
      actionTitle="Edit Artifact Quality"
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      wereSubmitDataChanged={hasFormChanged}
      onToggle={toggleModal}
      onSubmit={handleSubmit(confirmModal)}
      serviceContainer={serviceContainerArtifactEditQuality}
      modalVariant="large"
      onSuccessActions={
        variant === 'list'
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
          helperText={
            <FormHelperText
              isHidden={getFieldState(artifactQualityRevisionEntityAttributes.artifactQuality.id) !== 'error'}
              isError
            >
              {getFieldErrors(artifactQualityRevisionEntityAttributes.artifactQuality.id)}
            </FormHelperText>
          }
        >
          <FormInput<string>
            {...register<string>(artifactQualityRevisionEntityAttributes.artifactQuality.id, formConfig.artifactQuality)}
            render={({ value, validated, onChange, onBlur }) => (
              <Select
                menuAppendTo="parent"
                id={artifactQualityRevisionEntityAttributes.artifactQuality.id}
                name={artifactQualityRevisionEntityAttributes.artifactQuality.id}
                variant="single"
                isOpen={isQualitySelectOpen}
                selections={value}
                validated={validated}
                onToggle={setIsQualitySelectOpen}
                onSelect={(_, artifactQuality, isPlaceholder) => {
                  if (!isPlaceholder) {
                    onChange(artifactQuality as string);
                    setIsQualitySelectOpen(false);
                  }
                }}
                onBlur={onBlur}
              >
                {artifactEntityAttributes.artifactQuality.values.map((quality) => (
                  <SelectOption key={quality} value={quality} />
                ))}
              </Select>
            )}
          />
        </FormGroup>
        <FormGroup
          isRequired
          label={artifactQualityRevisionEntityAttributes.qualityLevelReason.title}
          fieldId={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
          helperText={
            <FormHelperText
              isHidden={getFieldState(artifactQualityRevisionEntityAttributes.qualityLevelReason.id) !== 'error'}
              isError
            >
              {getFieldErrors(artifactQualityRevisionEntityAttributes.qualityLevelReason.id)}
            </FormHelperText>
          }
        >
          <TextArea
            isRequired
            type="text"
            id={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            name={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            resizeOrientation="vertical"
            autoComplete="off"
            {...register<string>(artifactQualityRevisionEntityAttributes.qualityLevelReason.id, formConfig.qualityLevelReason)}
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
