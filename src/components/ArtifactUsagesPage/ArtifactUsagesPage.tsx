import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';

import * as artifactApi from 'services/artifactApi';

interface IArtifactUsagesPageProps {
  componentId?: string;
}

export const ArtifactUsagesPage = ({ componentId = 'b1' }: IArtifactUsagesPageProps) => {
  const { artifactId } = useParamsRequired();

  const { componentQueryParamsObject: artifactUsagesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuilds = useServiceContainer(artifactApi.getDependantBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig }),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildFinished(wsData)) {
          serviceContainerBuildsRunner({
            serviceData: { id: artifactId },
            requestConfig: { params: artifactUsagesQueryParamsObject },
          });
        }
      },
      [serviceContainerBuildsRunner, artifactUsagesQueryParamsObject, artifactId]
    )
  );

  return <BuildsList {...{ serviceContainerBuilds, componentId }} />;
};
