import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductVersionLink } from 'components/ProductVersionLink/ProductVersionLink';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as groupConfigApi from 'services/groupConfigApi';
import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

export const GroupConfigDetailPage = () => {
  const { groupConfigId } = useParams();

  const serviceContainerGroupConfig = useServiceContainer(groupConfigApi.getGroupConfig);
  const serviceContainerGroupConfigRunner = serviceContainerGroupConfig.run;

  const serviceContainerGroupBuilds = useServiceContainer(groupConfigApi.getGroupBuilds);
  const serviceContainerGroupBuildsRunner = serviceContainerGroupBuilds.run;

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerBuildConfigs = useServiceContainer(groupConfigApi.getBuildConfigsWithLatestBuild);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useEffect(() => {
    serviceContainerGroupConfigRunner({ serviceData: { id: groupConfigId } });
  }, [serviceContainerGroupConfigRunner, groupConfigId]);

  useEffect(() => {
    serviceContainerGroupConfig.data &&
      serviceContainerProductVersionRunner({
        serviceData: { id: serviceContainerGroupConfig.data.productVersion.id },
      });
  }, [serviceContainerProductVersionRunner, serviceContainerGroupConfig.data]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerGroupBuildsRunner({ serviceData: { id: groupConfigId }, requestConfig });
    },
    { componentId: 'gb' }
  );

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerBuildConfigsRunner({
        serviceData: { groupConfigId },
        requestConfig,
      });
    },
    { componentId: 'bc' }
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerGroupConfig,
      firstLevelEntity: 'Group Config',
      entityName: serviceContainerGroupConfig.data?.identifier,
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerGroupConfig} title="Group Config details">
      <PageLayout title={serviceContainerGroupConfig.data?.name}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={groupConfigEntityAttributes.name.title}>
              {serviceContainerGroupConfig.data?.name}
            </AttributesItem>
            <AttributesItem title={groupConfigEntityAttributes.productVersion.title}>
              <ServiceContainerLoading
                variant="inline"
                {...serviceContainerProductVersion}
                title={groupConfigEntityAttributes.productVersion.title}
              >
                <ProductVersionLink productVersion={serviceContainerProductVersion.data} />
              </ServiceContainerLoading>
            </AttributesItem>
          </Attributes>
        </ContentBox>
        <br />
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Build Configs</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop>
          <BuildConfigsList
            columns={['name', 'project.name', 'buildType', 'buildStatus', 'actions']}
            serviceContainerBuildConfigs={serviceContainerBuildConfigs}
            {...{ componentId: 'bc' }}
          />
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
