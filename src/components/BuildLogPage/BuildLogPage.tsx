import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

import * as buildApi from 'services/buildApi';

export const LOG_VIEWER_HEIGHT_OFFSET = -90;

export const BuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const { isBuilding } = useServiceContainerBuild();

  const serviceContainerBuildLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerBuildLogRunner = serviceContainerBuildLog.run;

  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerBuildLogRunner, buildId, isBuilding]);

  return (
    <>
      {!isBuilding && (
        <ServiceContainerLoading {...serviceContainerBuildLog} allowEmptyData title="Build Log">
          <LogViewer
            isStatic
            data={logData}
            customActions={[<BuildLogLink key="log-link" isIconVariant buildId={buildId!} />]}
            heightOffset={LOG_VIEWER_HEIGHT_OFFSET}
            autofocusSearchBar
          />
        </ServiceContainerLoading>
      )}

      {isBuilding && <EmptyStateCard title="Build Log" />}
    </>
  );
};
