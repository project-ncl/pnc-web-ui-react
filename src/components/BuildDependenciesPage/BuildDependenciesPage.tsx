import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';

import * as buildApi from 'services/buildApi';

interface IBuildDependenciesPageProps {
  componentId?: string;
}

export const BuildDependenciesPage = ({ componentId = 'd1' }: IBuildDependenciesPageProps) => {
  const { buildId } = useParamsRequired();

  const serviceContainerArtifacts = useServiceContainer(buildApi.getDependencies);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig }),
    { componentId }
  );

  return <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />;
};
