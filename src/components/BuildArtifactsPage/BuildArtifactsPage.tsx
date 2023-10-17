import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';

import * as buildApi from 'services/buildApi';

interface IBuildArtifactsPageProps {
  componentId?: string;
}

export const BuildArtifactsPage = ({ componentId = 'a1' }: IBuildArtifactsPageProps) => {
  const { buildId } = useParamsRequired();

  const serviceContainerArtifacts = useServiceContainer(buildApi.getBuiltArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig }),
    { componentId }
  );

  return <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />;
};
