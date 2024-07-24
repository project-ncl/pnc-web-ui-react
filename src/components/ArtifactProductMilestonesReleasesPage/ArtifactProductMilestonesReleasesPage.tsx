import { Text, TextContent, ToolbarItem } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactProductMilestonesReleasesList } from 'components/ArtifactProductMilestonesReleasesList/ArtifactProductMilestonesReleasesList';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as artifactApi from 'services/artifactApi';

interface IArtifactProductMilestonesReleasesPageProps {
  componentId?: string;
}

export const ArtifactProductMilestonesReleasesPage = ({ componentId = 'm1' }: IArtifactProductMilestonesReleasesPageProps) => {
  const { artifactId } = useParamsRequired();

  const serviceContainerArtifactProductMilestonesReleases = useServiceContainer(artifactApi.getProductMilestonesReleases);
  const serviceContainerArtifactProductMilestonesReleasesRunner = serviceContainerArtifactProductMilestonesReleases.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerArtifactProductMilestonesReleasesRunner({ serviceData: { id: artifactId }, requestConfig }),
      [serviceContainerArtifactProductMilestonesReleasesRunner, artifactId]
    ),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text>This list shows in which Product Version and Milestone this Artifact is used.</Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>
      <ArtifactProductMilestonesReleasesList {...{ serviceContainerArtifactProductMilestonesReleases, componentId }} />{' '}
    </>
  );
};
