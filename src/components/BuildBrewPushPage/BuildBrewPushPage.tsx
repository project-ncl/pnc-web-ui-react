import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { isAxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { buildPushResultEntityAttributes } from 'common/buildPushResultEntityAttributes';

import {
  brewPushLogMatchFiltersPrefix1,
  brewPushLogMatchFiltersPrefix2,
  brewPushLogPrefixFilters,
  useBifrostWebSocketEffect,
} from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBrewPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildPushStatusLabelMapper } from 'components/BuildPushStatusLabelMapper/BuildPushStatusLabelMapper';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildApi from 'services/buildApi';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const BuildBrewPushPage = () => {
  const { buildId } = useParamsRequired();

  const [isBrewPushEmpty, setIsBrewPushEmpty] = useState<boolean>(false);

  const serviceContainerBrewPush = useServiceContainer(buildApi.getBrewPush);
  const serviceContainerBrewPushRunner = serviceContainerBrewPush.run;

  const [logBuffer, addLogLines, resetLogBuffer] = useDataBuffer(timestampHiglighter);

  useEffect(() => {
    serviceContainerBrewPushRunner({
      serviceData: { id: buildId },
      onError: (result) => {
        if (isAxiosError(result.error) && result.error?.status === 404) {
          setIsBrewPushEmpty(true);
        }
      },
    });
  }, [serviceContainerBrewPushRunner, buildId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBrewPushFinished(wsData, { buildId })) {
          /**
           * Using Setter is not sufficient, all Runner related states need to be refreshed.
           * Implementing another approach is useless as Brew Push backend logic will be refactored soon in NCL-7346.
           */
          serviceContainerBrewPushRunner({ serviceData: { id: buildId } });
          setIsBrewPushEmpty(false);
        }
      },
      [serviceContainerBrewPushRunner, buildId]
    )
  );

  const filters = useMemo(
    () => ({
      prefixFilters: brewPushLogPrefixFilters,
      matchFilters: `${brewPushLogMatchFiltersPrefix1}${buildId}${brewPushLogMatchFiltersPrefix2}${
        serviceContainerBrewPush.data?.id ?? ''
      }`,
    }),
    [buildId, serviceContainerBrewPush.data?.id]
  );

  const preventListening = useMemo(() => !serviceContainerBrewPush.data?.id, [serviceContainerBrewPush.data?.id]);

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    // Clean up when WS close to prevent displaying log from previous brew-push.
    { filters, preventListening, onCleanup: resetLogBuffer }
  );

  return (
    <>
      {!isBrewPushEmpty ? (
        <>
          <ServiceContainerLoading {...serviceContainerBrewPush} title="Brew Push details">
            <ContentBox padding marginBottom isResponsive>
              <Attributes>
                <AttributesItem title={buildPushResultEntityAttributes.status.title}>
                  {serviceContainerBrewPush.data?.status && (
                    <BuildPushStatusLabelMapper status={serviceContainerBrewPush.data.status} />
                  )}
                </AttributesItem>
                <AttributesItem title={buildPushResultEntityAttributes.brewBuildId.title}>
                  {serviceContainerBrewPush.data?.brewBuildId}
                </AttributesItem>
                <AttributesItem title={buildPushResultEntityAttributes.brewBuildUrl.title}>
                  {serviceContainerBrewPush.data?.brewBuildUrl && (
                    <a target="_blank" rel="noreferrer" href={serviceContainerBrewPush.data.brewBuildUrl}>
                      {serviceContainerBrewPush.data.brewBuildUrl}
                    </a>
                  )}
                </AttributesItem>
              </Attributes>
            </ContentBox>

            <Toolbar borderBottom>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>Logs</Text>
                </TextContent>
              </ToolbarItem>
            </Toolbar>
            <ContentBox padding>
              <LogViewer isStatic={serviceContainerBrewPush?.data?.status !== 'ACCEPTED'} data={logBuffer} />
            </ContentBox>
          </ServiceContainerLoading>
        </>
      ) : (
        <ContentBox padding marginBottom>
          <EmptyStateCard title="Brew Push of the Build" />
        </ContentBox>
      )}
    </>
  );
};
