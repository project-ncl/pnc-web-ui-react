import { Text, TextContent } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactProductMilestonesReleasesList } from 'components/ArtifactProductMilestonesReleasesList/ArtifactProductMilestonesReleasesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as artifactApi from 'services/artifactApi';

interface IArtifactProductMilestonesReleasesPageProps {
  componentId?: string;
}

export const ArtifactProductMilestonesReleasesPage = ({ componentId = 'm1' }: IArtifactProductMilestonesReleasesPageProps) => {
  const { artifactId } = useParamsRequired();

  const serviceContainerArtifactProductMilestonesReleases = useServiceContainer(artifactApi.getProductMilestonesReleases);
  const serviceContainerArtifactProductMilestonesReleasesRunner = serviceContainerArtifactProductMilestonesReleases.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerArtifactProductMilestonesReleasesRunner({ serviceData: { id: artifactId }, requestConfig }),
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
