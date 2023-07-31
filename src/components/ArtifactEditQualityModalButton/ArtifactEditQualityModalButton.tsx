import { Button, Form, FormGroup, FormHelperText, Select, SelectOption, TextArea } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { artifactQualityRevisionEntityAttributes } from 'common/artifactQualityRevisionEntityAttributes';

import { IFields, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

import * as artifactApi from 'services/artifactApi';

interface IArtifactEditQualityModalButtonProps {
  artifact: Artifact;
  variant: IArtifactEditQualityModalProps['variant'];
}

export const ArtifactEditQualityModalButton = ({ artifact, variant }: IArtifactEditQualityModalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  return (
    <>
      <ProtectedComponent>
        <Button variant={variant === 'list' ? 'secondary' : 'tertiary'} onClick={toggleModal} isSmall>
          Edit Quality
        </Button>
      </ProtectedComponent>
      {isModalOpen && (
        <ArtifactEditQualityModal artifact={artifact} isModalOpen={isModalOpen} toggleModal={toggleModal} variant={variant} />
      )}
    </>
  );
};

const formConfig = {
  artifactQuality: {
    isRequired: true,
  },
  qualityLevelReason: {
    isRequired: true,
  },
};

interface IArtifactEditQualityModalProps {
  artifact: Artifact;
  isModalOpen: boolean;
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

const ArtifactEditQualityModal = ({ artifact, isModalOpen, toggleModal, variant }: IArtifactEditQualityModalProps) => {
  const serviceContainerArtifactEditQuality = useServiceContainer(artifactApi.editArtifactQuality, 0);

  const [isQualitySelectOpen, setIsQualitySelectOpen] = useState<boolean>(false);

  const confirmModal = (data: IFields) => {
    serviceContainerArtifactEditQuality
      .run({
        serviceData: {
          id: artifact.id,
        },
        requestConfig: {
          params: {
            quality: data.artifactQuality.value,
            reason: data.qualityLevelReason.value,
          },
        },
      })
      .catch(() => {
        console.error('Failed to edit Artifact Quality.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled, hasChanged } = useForm(formConfig, confirmModal);

  useEffect(() => {
    reinitialize({
      artifactQuality: artifact.artifactQuality,
    });
  }, [reinitialize, artifact.artifactQuality]);

  return (
    <ActionModal
      modalTitle={`Edit Artifact Quality: ${artifact.identifier}`}
      actionTitle="Edit Artifact Quality"
      isOpen={isModalOpen}
      isSubmitDisabled={isSubmitDisabled}
      hasFormChanged={hasChanged}
      onToggle={toggleModal}
      onSubmit={onSubmit}
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
            <FormHelperText isHidden={fields.artifactQuality.state !== 'error'} isError>
              {fields.artifactQuality.errorMessages?.join(' ')}
            </FormHelperText>
          }
        >
          <Select
            menuAppendTo="parent"
            id={artifactQualityRevisionEntityAttributes.artifactQuality.id}
            name={artifactQualityRevisionEntityAttributes.artifactQuality.id}
            variant="single"
            selections={fields.artifactQuality.value}
            validated={fields.artifactQuality.state}
            onSelect={(_, artifactQuality, isPlaceholder) => {
              if (!isPlaceholder) {
                onChange('artifactQuality', artifactQuality);
                setIsQualitySelectOpen(false);
              }
            }}
            onToggle={setIsQualitySelectOpen}
            isOpen={isQualitySelectOpen}
          >
            {artifactEntityAttributes.artifactQuality.values.map((quality) => (
              <SelectOption key={quality} value={quality} />
            ))}
          </Select>
        </FormGroup>
        <FormGroup
          isRequired
          label={artifactQualityRevisionEntityAttributes.qualityLevelReason.title}
          fieldId={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
          helperText={
            <FormHelperText isHidden={fields.qualityLevelReason.state !== 'error'} isError>
              {fields.qualityLevelReason.errorMessages?.join(' ')}
            </FormHelperText>
          }
        >
          <TextArea
            isRequired
            id={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            name={artifactQualityRevisionEntityAttributes.qualityLevelReason.id}
            type="text"
            value={fields.qualityLevelReason.value as string}
            validated={fields.qualityLevelReason.state}
            onChange={(qualityLevelReason) => {
              onChange('qualityLevelReason', qualityLevelReason);
            }}
            resizeOrientation="vertical"
            autoComplete="off"
          />
        </FormGroup>
      </Form>
    </ActionModal>
  );
};
