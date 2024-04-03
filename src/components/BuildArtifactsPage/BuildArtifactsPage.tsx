import { Text, TextContent, ToolbarItem } from '@patternfly/react-core';
import { useState } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactEditQualityModal } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ArtifactEditQualityModalButton } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModalButton';
import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as buildApi from 'services/buildApi';

interface IBuildArtifactsPageProps {
  componentId?: string;
}

export const BuildArtifactsPage = ({ componentId = 'a1' }: IBuildArtifactsPageProps) => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerArtifacts = useServiceContainer(buildApi.getBuiltArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const [isEditQualitiesModalOpen, setIsEditQualitiesModalOpen] = useState<boolean>(false);

  const toggleEditQualitiesModal = () => setIsEditQualitiesModalOpen((isEditQualitiesModalOpen) => !isEditQualitiesModalOpen);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component="h2">Artifacts</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ArtifactEditQualityModalButton
            toggleModal={toggleEditQualitiesModal}
            variant="detail"
            isBuildVariant
            buildArtifactsCount={serviceContainerArtifacts.data?.content?.length}
          />
        </ToolbarItem>
      </Toolbar>

      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />

      {isEditQualitiesModalOpen && (
        <ArtifactEditQualityModal
          isModalOpen={isEditQualitiesModalOpen}
          toggleModal={toggleEditQualitiesModal}
          build={serviceContainerBuild.data!}
          variant="detail"
        />
      )}
    </>
  );
};
