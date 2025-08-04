import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactProductMilestonesReleasesList } from 'components/ArtifactProductMilestonesReleasesList/ArtifactProductMilestonesReleasesList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
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
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerArtifactProductMilestonesReleasesRunner({ serviceData: { id: artifactId }, requestConfig }),
      [serviceContainerArtifactProductMilestonesReleasesRunner, artifactId]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.pagination }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <PageSectionHeader
            title="Milestones and Releases"
            description={<>This list shows in which Product Version and Milestone this Artifact is used.</>}
          />
        </ToolbarItem>
      </Toolbar>
      <ArtifactProductMilestonesReleasesList {...{ serviceContainerArtifactProductMilestonesReleases, componentId }} />{' '}
    </>
  );
};
