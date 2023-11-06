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
import { calculateLongBuildName } from 'components/BuildName/BuildName';
import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { BuildsList } from 'components/BuildsList/BuildsList';
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
        }
      },
      [
        serviceContainerGroupBuildSetter,
        groupBuildId,
        serviceContainerGroupBuildBuildsRunner,
        serviceContainerGroupBuildBuildsSetter,
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
  }, [serviceContainerGroupBuildRunner, groupBuildId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerGroupBuildBuildsRunner({ serviceData: { id: groupBuildId }, requestConfig }),
    { componentId }
  );

  return (
    <ServiceContainerLoading {...serviceContainerGroupBuild} title="Group Build details">
      <PageLayout
        title={<BuildStatus build={serviceContainerGroupBuild.data!} long hideDatetime hideUsername />}
        breadcrumbs={[{ entity: breadcrumbData.groupBuild.id, title: serviceContainerGroupBuild.data?.id }]}
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
            <DependencyTree groupBuild={serviceContainerGroupBuild.data!} />
          </ContentBox>
        )}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
