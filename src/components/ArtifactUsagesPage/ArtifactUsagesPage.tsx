import { useCallback } from 'react';

import { Build } from 'pnc-api-types-ts';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildStarted, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';

import * as artifactApi from 'services/artifactApi';

import { refreshPage } from 'utils/refreshHelper';

interface IArtifactUsagesPageProps {
  componentId?: string;
}

export const ArtifactUsagesPage = ({ componentId = 'b1' }: IArtifactUsagesPageProps) => {
  const { artifactId } = useParamsRequired();

  const { componentQueryParamsObject: artifactUsagesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuilds = useServiceContainer(artifactApi.getDependantBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;
  const serviceContainerBuildsSetter = serviceContainerBuilds.setData;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig }),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData)) {
          serviceContainerBuildsRunner({
            serviceData: { id: artifactId },
            requestConfig: { params: artifactUsagesQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData)) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerBuildsRunner, serviceContainerBuildsSetter, artifactUsagesQueryParamsObject, artifactId]
    )
  );

  return <BuildsList {...{ serviceContainerBuilds, componentId }} />;
};
