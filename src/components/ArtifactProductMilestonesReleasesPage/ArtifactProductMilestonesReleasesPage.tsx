import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactProductMilestonesReleasesList } from 'components/ArtifactProductMilestonesReleasesList/ArtifactProductMilestonesReleasesList';

import * as artifactApi from 'services/artifactApi';

interface IArtifactProductMilestonesReleasesPageProps {
  componentId?: string;
}

export const ArtifactProductMilestonesReleasesPage = ({ componentId = 'm1' }: IArtifactProductMilestonesReleasesPageProps) => {
  const { artifactId } = useParams();

  const serviceContainerArtifactProductMilestonesReleases = useServiceContainer(artifactApi.getProductMilestonesReleases);
  const serviceContainerArtifactProductMilestonesReleasesRunner = serviceContainerArtifactProductMilestonesReleases.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerArtifactProductMilestonesReleasesRunner({ serviceData: { id: artifactId }, requestConfig }),
    { componentId }
  );

  return <ArtifactProductMilestonesReleasesList {...{ serviceContainerArtifactProductMilestonesReleases, componentId }} />;
};
