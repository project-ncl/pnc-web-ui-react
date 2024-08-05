import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';

import { GroupBuild } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasGroupBuildStarted, hasGroupBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { DataValues, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { BuildHistoryList } from 'components/BuildHistoryList/BuildHistoryList';
import { BuildStartButton } from 'components/BuildStartButton/BuildStartButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductVersionLink } from 'components/ProductVersionLink/ProductVersionLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as groupConfigApi from 'services/groupConfigApi';
import * as productVersionApi from 'services/productVersionApi';

import { refreshPage } from 'utils/refreshHelper';
import { generatePageTitle } from 'utils/titleHelper';

const buildConfigsListColumns = [
  buildConfigEntityAttributes.name.id,
  buildConfigEntityAttributes['project.name'].id,
  buildConfigEntityAttributes.creationTime.id,
  buildConfigEntityAttributes.modificationTime.id,
  buildConfigEntityAttributes.actions.id,
  buildConfigEntityAttributes['environment.deprecated'].id,
];

interface IGroupConfigDetailPageProps {
  componentIdGroupBuilds?: string;
  componentIdBuildConfigs?: string;
}

export const GroupConfigDetailPage = ({
  componentIdGroupBuilds = 'b1',
  componentIdBuildConfigs = 'c1',
}: IGroupConfigDetailPageProps) => {
  const { groupConfigId } = useParamsRequired();

  const { componentQueryParamsObject: groupBuildsQueryParamsObject } = useComponentQueryParams(componentIdGroupBuilds);

  const serviceContainerGroupConfig = useServiceContainer(groupConfigApi.getGroupConfig);
  const serviceContainerGroupConfigRunner = serviceContainerGroupConfig.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerGroupBuilds = useServiceContainer(groupConfigApi.getGroupBuilds);
  const serviceContainerGroupBuildsRunner = serviceContainerGroupBuilds.run;
  const serviceContainerGroupBuildsSetter = serviceContainerGroupBuilds.setData;

  const serviceContainerBuildConfigs = useServiceContainer(groupConfigApi.getBuildConfigsWithLatestBuild);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useEffect(() => {
    serviceContainerGroupConfigRunner({
      serviceData: { id: groupConfigId },
      onSuccess: (result) => {
        const groupConfig = result.response.data;

        if (groupConfig.productVersion) {
          serviceContainerProductVersionRunner({ serviceData: { id: groupConfig.productVersion.id } });
        }
      },
    });
  }, [serviceContainerGroupConfigRunner, serviceContainerProductVersionRunner, groupConfigId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => {
        serviceContainerGroupBuildsRunner({ serviceData: { id: groupConfigId }, requestConfig });
      },
      [serviceContainerGroupBuildsRunner, groupConfigId]
    ),
    { componentId: componentIdGroupBuilds }
  );

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => {
        serviceContainerBuildConfigsRunner({ serviceData: { groupConfigId }, requestConfig });
      },
      [serviceContainerBuildConfigsRunner, groupConfigId]
    ),
    { componentId: componentIdBuildConfigs }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasGroupBuildStarted(wsData, { groupConfigId })) {
          serviceContainerGroupBuildsRunner({
            serviceData: { id: groupConfigId },
            requestConfig: { params: groupBuildsQueryParamsObject },
          });
        } else if (hasGroupBuildStatusChanged(wsData, { groupConfigId })) {
          const wsGroupBuild: GroupBuild = wsData.groupBuild;
          serviceContainerGroupBuildsSetter((previousGroupBuildPage) => refreshPage(previousGroupBuildPage!, wsGroupBuild));
        }
      },
      [serviceContainerGroupBuildsRunner, serviceContainerGroupBuildsSetter, groupBuildsQueryParamsObject, groupConfigId]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerGroupConfig,
      firstLevelEntity: 'Group Config',
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerGroupConfig} title="Group Config details">
      <PageLayout
        title={serviceContainerGroupConfig.data?.name}
        breadcrumbs={[{ entity: breadcrumbData.groupConfig.id, title: serviceContainerGroupConfig.data?.name }]}
        actions={[
          <ProtectedComponent key="group-build-start-button">
            <BuildStartButton groupConfig={serviceContainerGroupConfig.data!} />
          </ProtectedComponent>,
          <ProtectedComponent key="edit-group-config-button">
            <ActionButton variant="tertiary" link="edit">
              Edit Group Config
            </ActionButton>
          </ProtectedComponent>,
        ]}
        sidebar={{
          title: 'Build History',
          content: (
            <BuildHistoryList
              serviceContainerBuilds={serviceContainerGroupBuilds}
              variant="Group Build"
              componentId={componentIdGroupBuilds}
            />
          ),
        }}
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={groupConfigEntityAttributes.name.title}>
              {serviceContainerGroupConfig.data?.name}
            </AttributesItem>
            <AttributesItem title={groupConfigEntityAttributes.productVersion.title}>
              {(serviceContainerProductVersion.loading || serviceContainerProductVersion.data !== DataValues.notYetData) && (
                <ServiceContainerLoading
                  {...serviceContainerProductVersion}
                  variant="inline"
                  title={groupConfigEntityAttributes.productVersion.title}
                >
                  <ProductVersionLink productVersion={serviceContainerProductVersion.data!} />
                </ServiceContainerLoading>
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar borderBottom>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Build Configs</Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem>
            <ProtectedComponent>
              <ActionButton link="build-configs/edit">Edit list</ActionButton>
            </ProtectedComponent>
          </ToolbarItem>
        </Toolbar>

        <BuildConfigsList
          columns={buildConfigsListColumns}
          serviceContainerBuildConfigs={serviceContainerBuildConfigs}
          componentId={componentIdBuildConfigs}
        />
      </PageLayout>
    </ServiceContainerLoading>
  );
};
