import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { calculateLongBuildName } from 'components/BuildName/BuildName';
import { BuildsList } from 'components/BuildsList/BuildsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DependencyTree } from 'components/DependencyTree/DependencyTree';
import { GroupConfigLink } from 'components/GroupConfigLink/GroupConfigLink';
import { NestedTabs } from 'components/NestedTabs/NestedTabs';
import { NestedTabsItem } from 'components/NestedTabs/NestedTabsItem';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as groupBuildApi from 'services/groupBuildApi';

import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime } from 'utils/utils';

interface IGroupBuildDetailPageProps {
  componentId?: string;
}

export const GroupBuildDetailPage = ({ componentId = 'gb2' }: IGroupBuildDetailPageProps) => {
  const { groupBuildId } = useParams();

  const [activeTabKey, setActiveTabKey] = useState<number>(0);

  const serviceContainerGroupBuild = useServiceContainer(groupBuildApi.getGroupBuild);
  const serviceContainerGroupBuildRunner = serviceContainerGroupBuild.run;

  const serviceContainerGroupBuildBuilds = useServiceContainer(groupBuildApi.getBuilds);
  const serviceContainerGroupBuildBuildsRunner = serviceContainerGroupBuildBuilds.run;

  const longGroupBuildName = calculateLongBuildName(serviceContainerGroupBuild.data);

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
      <PageLayout title={`Group Build ${longGroupBuildName}`}>
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={groupBuildEntityAttributes.status.title}>
              {serviceContainerGroupBuild.data?.status}
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes.groupConfig.title}>
              <GroupConfigLink id={serviceContainerGroupBuild.data?.groupConfig.id}>
                {serviceContainerGroupBuild.data?.groupConfig.name}
              </GroupConfigLink>
            </AttributesItem>
            <AttributesItem title={groupBuildEntityAttributes['user.username'].title}>
              {serviceContainerGroupBuild.data?.user.username}
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
            <DependencyTree groupBuild={serviceContainerGroupBuild.data} />
          </ContentBox>
        )}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
