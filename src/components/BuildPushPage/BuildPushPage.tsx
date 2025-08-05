import { useCallback, useEffect, useMemo } from 'react';

import { buildPushOperationEntityAttributes } from 'common/buildPushOperationEntityAttributes';
import { buildPushReportEntityAttributes } from 'common/buildPushReportEntityAttributes';

import {
  brewPushLogMatchFiltersPrefix1,
  brewPushLogMatchFiltersPrefix2,
  brewPushLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { OperationProgressStatusLabelMapper } from 'components/LabelMapper/OperationProgressStatusLabelMapper';
import { OperationResultLabelMapper } from 'components/LabelMapper/OperationResultLabelMapper';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildPushesApi from 'services/buildPushesApi';
import * as operationsApi from 'services/operationsApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const BuildPushPage = () => {
  const { buildId, buildPushId } = useParamsRequired();

  const serviceContainerBuildPushOperation = useServiceContainer(operationsApi.getBuildPush);
  const serviceContainerBuildPushOperationRunner = serviceContainerBuildPushOperation.run;

  const serviceContainerBuildPushReport = useServiceContainer(buildPushesApi.getBuildPush);
  const serviceContainerBuildPushReportRunner = serviceContainerBuildPushReport.run;

  const [logBuffer, addLogLines, resetLogBuffer] = useDataBuffer(timestampHiglighter);

  useEffect(() => {
    serviceContainerBuildPushOperationRunner({
      serviceData: { id: buildPushId },
      onSuccess: (result) => {
        if (result.response.data.result === 'SUCCESSFUL') {
          serviceContainerBuildPushReportRunner({ serviceData: { id: buildPushId } });
        }
      },
    });
  }, [serviceContainerBuildPushOperationRunner, serviceContainerBuildPushReportRunner, buildPushId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildPushFinished(wsData, { buildId })) {
          /**
           * Using Setter is not sufficient, all Runner related states need to be refreshed.
           * Implementing another approach is useless as Brew Push backend logic will be refactored soon in NCL-7346.
           */
          serviceContainerBuildPushOperationRunner({
            serviceData: { id: buildPushId },
            onSuccess: (result) => {
              if (result.response.data.result === 'SUCCESSFUL') {
                serviceContainerBuildPushReportRunner({ serviceData: { id: buildPushId } });
              }
            },
          });
        }
      },
      [serviceContainerBuildPushOperationRunner, serviceContainerBuildPushReportRunner, buildId, buildPushId]
    )
  );

  const filters = useMemo(
    () => ({
      prefixFilters: brewPushLogPrefixFilters,
      matchFilters: `${brewPushLogMatchFiltersPrefix1}${buildId}${brewPushLogMatchFiltersPrefix2}${
        serviceContainerBuildPushOperation.data?.id ?? ''
      }`,
    }),
    [buildId, serviceContainerBuildPushOperation.data?.id]
  );

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    // Clean up when WS close to prevent displaying log from previous build-push.
    { filters, onCleanup: resetLogBuffer }
  );

  return (
    <ServiceContainerLoading {...serviceContainerBuildPushOperation} title="Build Push details">
      <ContentBox padding marginBottom isResponsive>
        <Attributes>
          <AttributesItem title={buildPushOperationEntityAttributes.progressStatus.title}>
            {serviceContainerBuildPushOperation.data?.progressStatus && (
              <OperationProgressStatusLabelMapper progressStatus={serviceContainerBuildPushOperation.data.progressStatus} />
            )}
          </AttributesItem>
          <AttributesItem title={buildPushOperationEntityAttributes.result.title}>
            {serviceContainerBuildPushOperation.data?.result && (
              <OperationResultLabelMapper result={serviceContainerBuildPushOperation.data.result} />
            )}
          </AttributesItem>
          <AttributesItem title={buildPushReportEntityAttributes.brewBuildId.title}>
            {serviceContainerBuildPushReport.data?.brewBuildId}
          </AttributesItem>
          <AttributesItem title={buildPushReportEntityAttributes.brewBuildUrl.title}>
            {serviceContainerBuildPushReport.data?.brewBuildUrl && (
              <a target="_blank" rel="noreferrer" href={serviceContainerBuildPushReport.data.brewBuildUrl}>
                {serviceContainerBuildPushReport.data.brewBuildUrl}
              </a>
            )}
          </AttributesItem>
        </Attributes>
      </ContentBox>

      <Toolbar>
        <ToolbarItem>
          <PageSectionHeader title="Logs" />
        </ToolbarItem>
      </Toolbar>
      <LogViewer isStatic={serviceContainerBuildPushOperation?.data?.progressStatus !== 'IN_PROGRESS'} data={logBuffer} />
    </ServiceContainerLoading>
  );
};
