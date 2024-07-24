import { useCallback, useEffect, useState } from 'react';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import {
  hasBuildStarted,
  hasBuildStatusChanged,
  hasGroupBuildStatusChanged,
  usePncWebSocketEffect,
} from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BrewPushModal } from 'components/BrewPushModal/BrewPushModal';
import { BrewPushModalButton } from 'components/BrewPushModal/BrewPushModalButton';
import { calculateLongBuildName } from 'components/BuildName/BuildName';
import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { BuildsList } from 'components/BuildsList/BuildsList';
import { CancelBuildModal } from 'components/CancelBuildModal/CancelBuildModal';
import { CancelBuildModalButton } from 'components/CancelBuildModal/CancelBuildModalButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DependencyTree } from 'components/DependencyTree/DependencyTree';
import { GroupConfigLink } from 'components/GroupConfigLink/GroupConfigLink';
import { NestedTabs } from 'components/NestedTabs/NestedTabs';
import { NestedTabsItem } from 'components/NestedTabs/NestedTabsItem';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as groupBuildApi from 'services/groupBuildApi';

import { refreshPage } from 'utils/refreshHelper';
import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime } from 'utils/utils';

interface IGroupBuildDetailPageProps {
  componentId?: string;
}

export const GroupBuildDetailPage = ({ componentId = 'gb2' }: IGroupBuildDetailPageProps) => {
  const { groupBuildId } = useParamsRequired();

  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  const { componentQueryParamsObject: groupBuildBuildsComponentQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerGroupBuild = useServiceContainer(groupBuildApi.getGroupBuild);
  const serviceContainerGroupBuildRunner = serviceContainerGroupBuild.run;
  const serviceContainerGroupBuildSetter = serviceContainerGroupBuild.setData;

  const serviceContainerGroupBuildBuilds = useServiceContainer(groupBuildApi.getBuilds);
  const serviceContainerGroupBuildBuildsRunner = serviceContainerGroupBuildBuilds.run;
  const serviceContainerGroupBuildBuildsSetter = serviceContainerGroupBuildBuilds.setData;

  const serviceContainerDependencyGraph = useServiceContainer(groupBuildApi.getDependencyGraph);
  const serviceContainerDependencyGraphRunner = serviceContainerDependencyGraph.run;
  const serviceContainerDependencyGraphSetter = serviceContainerDependencyGraph.setData;

  const [isCancelGroupBuildModalOpen, setIsCancelGroupBuildModalOpen] = useState<boolean>(false);
  const [isBrewPushModalOpen, setIsBrewPushModalOpen] = useState<boolean>(false);

  const toggleCancelGroupBuildModal = () =>
    setIsCancelGroupBuildModalOpen((isCancelGroupBuildModalOpen) => !isCancelGroupBuildModalOpen);
  const toggleBrewPushModal = () => setIsBrewPushModalOpen((isBrewPushModalOpen) => !isBrewPushModalOpen);

  const longGroupBuildName = serviceContainerGroupBuild.data
    ? calculateLongBuildName(serviceContainerGroupBuild.data)
    : undefined;

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasGroupBuildStatusChanged(wsData, { groupBuildId })) {
          const wsGroupBuild: GroupBuild = wsData.groupBuild;
          serviceContainerGroupBuildSetter(wsGroupBuild);
        } else if (hasBuildStarted(wsData, { groupBuildId })) {
          // very exceptional use case, mostly it means backend issues
          serviceContainerGroupBuildBuildsRunner({
            serviceData: { id: groupBuildId },
            requestConfig: { params: groupBuildBuildsComponentQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData, { groupBuildId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerGroupBuildBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));

          if (
            serviceContainerDependencyGraph.data?.vertices &&
            Object.keys(serviceContainerDependencyGraph.data.vertices).includes(wsBuild.id)
          ) {
            const updatedVertex = { ...serviceContainerDependencyGraph.data.vertices[wsBuild.id], data: wsBuild };

            serviceContainerDependencyGraphSetter({
              ...serviceContainerDependencyGraph.data,
              vertices: { ...serviceContainerDependencyGraph.data.vertices, [wsBuild.id]: updatedVertex },
            });
          }
        }
      },
      [
        serviceContainerGroupBuildSetter,
        groupBuildId,
        serviceContainerGroupBuildBuildsRunner,
        serviceContainerGroupBuildBuildsSetter,
        serviceContainerDependencyGraphSetter,
        serviceContainerDependencyGraph.data,
        groupBuildBuildsComponentQueryParamsObject,
      ]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerGroupBuild,
      firstLevelEntity: 'Group Build',
      entityName: longGroupBuildName,
    })
  );

  useEffect(() => {
    serviceContainerGroupBuildRunner({ serviceData: { id: groupBuildId } });
    serviceContainerDependencyGraphRunner({ serviceData: { id: groupBuildId } });
  }, [serviceContainerGroupBuildRunner, serviceContainerDependencyGraphRunner, groupBuildId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerGroupBuildBuildsRunner({ serviceData: { id: groupBuildId }, requestConfig }),
      [serviceContainerGroupBuildBuildsRunner, groupBuildId]
    ),
    { componentId }
  );

  return (
    <ServiceContainerLoading {...serviceContainerGroupBuild} title="Group Build details">
      <PageLayout
        title={<BuildStatus build={serviceContainerGroupBuild.data!} long hideDatetime hideUsername includeConfigLink />}
        breadcrumbs={[{ entity: breadcrumbData.groupBuild.id, title: serviceContainerGroupBuild.data?.id }]}
        actions={
          <>
            <CancelBuildModalButton
              toggleModal={toggleCancelGroupBuildModal}
              build={serviceContainerGroupBuild.data!}
              variant="Group Build"
            />
            <BrewPushModalButton toggleModal={toggleBrewPushModal} build={serviceContainerGroupBuild.data!} />
          </>
        }
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={groupBuildEntityAttributes.status.title}>
              <BuildStatusIcon build={serviceContainerGroupBuild.data!} long />
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes.groupConfig.title}>
              {serviceContainerGroupBuild.data?.groupConfig?.id && (
                <GroupConfigLink id={serviceContainerGroupBuild.data.groupConfig.id}>
                  {serviceContainerGroupBuild.data?.groupConfig.name}
                </GroupConfigLink>
              )}
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes['user.username'].title}>
              {serviceContainerGroupBuild.data?.user?.username}
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes.startTime.title}>
              {serviceContainerGroupBuild.data?.startTime &&
                createDateTime({ date: serviceContainerGroupBuild.data.startTime }).custom}
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes.endTime.title}>
              {serviceContainerGroupBuild.data?.endTime &&
                createDateTime({ date: serviceContainerGroupBuild.data.endTime }).custom}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <NestedTabs activeTabKey={activeTabKey} onTabSelect={(tabKey) => setActiveTabKey(tabKey)}>
          <NestedTabsItem tabKey={0}>Builds</NestedTabsItem>
          <NestedTabsItem tabKey={1}>Build Dependencies</NestedTabsItem>
        </NestedTabs>

        {activeTabKey === 0 && (
          <ContentBox>
            <BuildsList
              {...{
                serviceContainerBuilds: serviceContainerGroupBuildBuilds,
                componentId,
              }}
            />
          </ContentBox>
        )}

        {activeTabKey === 1 && (
          <ContentBox padding>
            <DependencyTree
              rootBuild={serviceContainerGroupBuild.data!}
              serviceContainerDependencyGraph={serviceContainerDependencyGraph}
            />
          </ContentBox>
        )}
      </PageLayout>

      {isCancelGroupBuildModalOpen && (
        <CancelBuildModal
          isModalOpen={isCancelGroupBuildModalOpen}
          toggleModal={toggleCancelGroupBuildModal}
          build={serviceContainerGroupBuild.data!}
          variant="Group Build"
        />
      )}

      {isBrewPushModalOpen && (
        <BrewPushModal
          isModalOpen={isBrewPushModalOpen}
          toggleModal={toggleBrewPushModal}
          build={serviceContainerGroupBuild.data!}
          variant="Group Build"
        />
      )}
    </ServiceContainerLoading>
  );
};
