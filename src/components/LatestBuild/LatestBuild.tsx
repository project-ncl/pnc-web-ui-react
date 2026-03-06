import { useCallback, useEffect, useMemo } from 'react';

import { Build, BuildConfiguration } from 'pnc-api-types-ts';

import { hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';

import { debounce } from 'utils/utils';

interface ILatestBuild {
  buildConfigId: BuildConfiguration['id'];
}

const singleItem = { params: { pageSize: 1 } };

/**
 * Display the latest Build for Build Config. Group Build Config is not supported yet.
 *
 * @param buildConfigId - Build Config ID for which the lastest Build will be displayed
 */
export const LatestBuild = ({ buildConfigId }: ILatestBuild) => {
  const serviceContainerBuildConfig = useServiceContainer(buildConfigApi.getBuilds);
  const serviceContainerBuildConfigRunner = serviceContainerBuildConfig.run;

  const serviceContainerBuildConfigRunnerDebounced = useMemo(
    () => debounce(serviceContainerBuildConfigRunner),
    [serviceContainerBuildConfigRunner]
  );

  useEffect(() => {
    serviceContainerBuildConfigRunner({ serviceData: { id: buildConfigId }, requestConfig: singleItem });
  }, [serviceContainerBuildConfigRunner, buildConfigId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStatusChanged(wsData, { buildConfigId })) {
          serviceContainerBuildConfigRunnerDebounced({ serviceData: { id: buildConfigId }, requestConfig: singleItem });
        }
      },
      [serviceContainerBuildConfigRunnerDebounced, buildConfigId]
    )
  );

  useEffect(() => {
    return () => {
      serviceContainerBuildConfigRunnerDebounced.cancel();
    };
  }, [serviceContainerBuildConfigRunnerDebounced]);

  return (
    <ServiceContainerLoading {...serviceContainerBuildConfig} title="Build Status" variant="inline">
      {serviceContainerBuildConfig.data?.content?.at(0) ? (
        <BuildStatus build={serviceContainerBuildConfig.data?.content?.at(0) as Build} includeBuildLink hideDatetime />
      ) : (
        <EmptyStateSymbol text="No Build was executed" />
      )}
    </ServiceContainerLoading>
  );
};
