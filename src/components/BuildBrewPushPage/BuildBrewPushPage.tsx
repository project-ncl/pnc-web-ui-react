import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { buildPushResultEntityAttributes } from 'common/buildPushResultEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildPushStatusLabelMapper } from 'components/BuildPushStatusLabelMapper/BuildPushStatusLabelMapper';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

import * as buildApi from 'services/buildApi';

export const BuildBrewPushPage = () => {
  const { buildId } = useParams();

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
        <ContentBox padding marginBottom isResponsive>
          <EmptyStateCard title="Brew Push of the Build" />
        </ContentBox>
      )}
    </>
  );
};
