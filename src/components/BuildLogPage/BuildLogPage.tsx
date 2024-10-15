import { useCallback, useEffect, useMemo } from 'react';

import { buildLogMatchFiltersPrefix, buildLogPrefixFilters, useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const LOG_VIEWER_HEIGHT_OFFSET = -90;

export const BuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();
  const isBuilding = useMemo(() => serviceContainerBuild.data?.status === 'BUILDING', [serviceContainerBuild.data?.status]);

  const serviceContainerBuildLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerBuildLogRunner = serviceContainerBuildLog.run;

  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerBuildLogRunner, buildId, isBuilding]);

  const filters = useMemo(
    () => ({
      prefixFilters: buildLogPrefixFilters,
      matchFilters: `${buildLogMatchFiltersPrefix}${buildId}`,
    }),
    [buildId]
  );

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    {
      filters,
      preventListening: !isBuilding,
    }
  );

  const logActions = [<BuildLogLink key="log-link" isIconVariant buildId={buildId!} />];

  return (
    <>
      {!isBuilding && (
        <ContentBox>
          <ServiceContainerLoading {...serviceContainerBuildLog} allowEmptyData title="Build Log">
            <ContentBox padding>
              <LogViewer isStatic data={logData} customActions={logActions} heightOffset={LOG_VIEWER_HEIGHT_OFFSET} />
            </ContentBox>
          </ServiceContainerLoading>
        </ContentBox>
      )}

      {isBuilding && (
        <ContentBox>
          <ContentBox padding>
            <LogViewer data={logBuffer} heightOffset={LOG_VIEWER_HEIGHT_OFFSET} />
          </ContentBox>
        </ContentBox>
      )}
    </>
  );
};
