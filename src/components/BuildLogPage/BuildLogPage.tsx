import { useCallback, useEffect, useMemo } from 'react';

import { useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
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

export const BuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();
  const isBuilding = useMemo(() => serviceContainerBuild.data?.status === 'BUILDING', [serviceContainerBuild.data?.status]);

  const serviceContainerBuildLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerBuildLogRunner = serviceContainerBuildLog.run;

  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  const [logBuffer, addLogLines] = useDataBuffer(100, timestampHiglighter);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerBuildLogRunner, buildId, isBuilding]);

  useBifrostWebSocketEffect(
    useCallback(
      (logLine: string) => {
        addLogLines([logLine]);
      },
      [addLogLines]
    ),
    { buildId }
  );

  const logActions = [<BuildLogLink key="log-link" buildId={buildId!} />];

  return (
    <>
      {!isBuilding && (
        <ContentBox>
          <ServiceContainerLoading {...serviceContainerBuildLog} allowEmptyData title="Build Log">
            <ContentBox padding>
              <LogViewer isStatic data={logData} customActions={logActions} />
            </ContentBox>
          </ServiceContainerLoading>
        </ContentBox>
      )}

      {isBuilding && (
        <ContentBox>
          <ContentBox padding>
            <LogViewer data={logBuffer} />
          </ContentBox>
        </ContentBox>
      )}
    </>
  );
};
