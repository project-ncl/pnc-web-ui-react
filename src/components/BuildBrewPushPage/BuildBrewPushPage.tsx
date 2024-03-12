import { useCallback, useEffect, useState } from 'react';

import { buildPushResultEntityAttributes } from 'common/buildPushResultEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBrewPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildPushStatusLabelMapper } from 'components/BuildPushStatusLabelMapper/BuildPushStatusLabelMapper';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

import * as buildApi from 'services/buildApi';

export const BuildBrewPushPage = () => {
  const { buildId } = useParamsRequired();

  const [isBrewPushEmpty, setIsBrewPushEmpty] = useState<boolean>(false);

  const serviceContainerBrewPush = useServiceContainer(buildApi.getBrewPush);
  const serviceContainerBrewPushRunner = serviceContainerBrewPush.run;

  useEffect(() => {
    serviceContainerBrewPushRunner({ serviceData: { id: buildId } }).catch((error: any) => {
      if (error.response?.status === 404) {
        setIsBrewPushEmpty(true);
      } else {
        throw error;
      }
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

  return (
    <>
      {!isBrewPushEmpty ? (
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
        </ServiceContainerLoading>
      ) : (
        <ContentBox padding marginBottom>
          <EmptyStateCard title="Brew Push of the Build" />
        </ContentBox>
      )}
    </>
  );
};
