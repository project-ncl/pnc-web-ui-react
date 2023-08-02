import { Button, Modal } from '@patternfly/react-core';
import { InnerScrollContainer } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactQualityRevisionsList } from 'components/ArtifactQualityRevisionsList/ArtifactQualityRevisionsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

import * as artifactApi from 'services/artifactApi';

import { updateQueryParamsInURL } from 'utils/queryParamsHelper';

interface IArtifactQualityRevisionsModalButtonProps {
  artifact: Artifact;
  componentId?: string;
}

export const ArtifactQualityRevisionsModalButton = ({
  artifact,
  componentId = 'r1',
}: IArtifactQualityRevisionsModalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isModalOpen) {
      updateQueryParamsInURL({ q: '', sort: '', pageSize: '', pageIndex: '' }, componentId, location, navigate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, componentId]);

  const toggleModal = () => {
    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  return (
    <>
      <ProtectedComponent>
        <Button variant="secondary" isSmall onClick={toggleModal}>
          Quality Revisions
        </Button>
      </ProtectedComponent>
      {isModalOpen && (
        <ArtifactQualityRevisionsModal
          artifact={artifact}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          componentId={componentId}
        />
      )}
    </>
  );
};

interface IArtifactQualityRevisionsModalProps {
  artifact: Artifact;
  isModalOpen: boolean;
  toggleModal: () => void;
  componentId: string;
}

const ArtifactQualityRevisionsModal = ({
  artifact,
  isModalOpen,
  toggleModal,
  componentId,
}: IArtifactQualityRevisionsModalProps) => {
  const serviceContainerQualityRevisions = useServiceContainer(artifactApi.getQualityRevisions);
  const serviceContainerQualityRevisionsRunner = serviceContainerQualityRevisions.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerQualityRevisionsRunner({ serviceData: { id: artifact.id }, requestConfig }),
    { componentId: 'r1' }
  );

  return (
    <Modal
      title={`Quality Revisions: ${artifact.identifier}`}
      variant="large"
      hasNoBodyWrapper
      isOpen={isModalOpen}
      onClose={toggleModal}
    >
      <InnerScrollContainer>
        <ArtifactQualityRevisionsList {...{ serviceContainerQualityRevisions, componentId }} />
      </InnerScrollContainer>
    </Modal>
  );
};
