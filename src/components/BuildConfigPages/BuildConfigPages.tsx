import { useCallback, useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { Build, BuildConfiguration } from 'pnc-api-types-ts';

import { SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildStarted, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigCloneModal } from 'components/BuildConfigCloneModal/BuildConfigCloneModal';
import { BuildConfigCloneModalButton } from 'components/BuildConfigCloneModal/BuildConfigCloneModalButton';
import { BuildHistoryList } from 'components/BuildHistoryList/BuildHistoryList';
import { BuildStartButton } from 'components/BuildStartButton/BuildStartButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';

import { refreshPage } from 'utils/refreshHelper';
import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerBuildConfig: IServiceContainerState<BuildConfiguration> };

interface IBuildConfigPagesProps {
  componentIdBuildHistory?: string;
}

export const BuildConfigPages = ({ componentIdBuildHistory = 'bh1' }: IBuildConfigPagesProps) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerBuildConfig = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerBuildConfigRunner = serviceContainerBuildConfig.run;

  const { componentQueryParamsObject: buildHistoryQueryParamsObject } = useComponentQueryParams(componentIdBuildHistory);

  const serviceContainerBuilds = useServiceContainer(buildConfigApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;
  const serviceContainerBuildsSetter = serviceContainerBuilds.setData;

  const serviceContainerDependencies = useServiceContainer(buildConfigApi.getDependencies);
  const serviceContainerDependenciesRunner = serviceContainerDependencies.run;

  const serviceContainerDependants = useServiceContainer(buildConfigApi.getDependants);
  const serviceContainerDependantsRunner = serviceContainerDependants.run;

  const serviceContainerGroupConfigs = useServiceContainer(buildConfigApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  const serviceContainerRevisions = useServiceContainer(buildConfigApi.getRevisions);
  const serviceContainerRevisionsRunner = serviceContainerRevisions.run;

  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const toggleCloneModal = () => setIsCloneModalOpen((isCloneModalOpen) => !isCloneModalOpen);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerBuildsRunner({ serviceData: { id: buildConfigId }, requestConfig });
    },
    { componentId: componentIdBuildHistory }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData, { buildConfigId })) {
          serviceContainerBuildsRunner({
            serviceData: { id: buildConfigId },
            requestConfig: { params: buildHistoryQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData, { buildConfigId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerBuildsRunner, serviceContainerBuildsSetter, buildHistoryQueryParamsObject, buildConfigId]
    )
  );

  useEffect(() => {
    serviceContainerBuildConfigRunner({ serviceData: { id: buildConfigId } });
    serviceContainerDependenciesRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerDependantsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerGroupConfigsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerRevisionsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [
    serviceContainerBuildConfigRunner,
    serviceContainerDependenciesRunner,
    serviceContainerDependantsRunner,
    serviceContainerGroupConfigsRunner,
    serviceContainerRevisionsRunner,
    buildConfigId,
  ]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerBuildConfig,
      firstLevelEntity: 'Build Config',
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="dependencies">
        Dependencies{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependencies} title="Dependencies Count">
          {serviceContainerDependencies.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="dependants">
        Dependants{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependants} title="Dependants Count">
          {serviceContainerDependants.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="group-configs">
        Group Configs{' '}
        <PageTabsLabel serviceContainer={serviceContainerGroupConfigs} title="Group Configs Count">
          {serviceContainerGroupConfigs.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="revisions">
        Revisions{' '}
        <PageTabsLabel serviceContainer={serviceContainerRevisions} title="Revisions Count">
          {serviceContainerRevisions.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="build-metrics">Build Metrics</PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerBuildConfig} title="Build Config details">
      <PageLayout
        title={serviceContainerBuildConfig.data?.name}
        tabs={pageTabs}
        actions={[
          <ProtectedComponent>
            <BuildStartButton buildConfig={serviceContainerBuildConfig.data!} isCompact />
          </ProtectedComponent>,
          <BuildConfigCloneModalButton toggleModal={toggleCloneModal} variant="detail" />,
          <ProtectedComponent>
            <ActionButton variant="tertiary" link="edit">
              Edit
            </ActionButton>
          </ProtectedComponent>,
        ]}
        sidebar={{
          title: 'Build History',
          content: (
            <BuildHistoryList
              serviceContainerBuilds={serviceContainerBuilds}
              variant="Build"
              componentId={componentIdBuildHistory}
            />
          ),
        }}
      >
        <Outlet context={{ serviceContainerBuildConfig }} />
      </PageLayout>
      {isCloneModalOpen && (
        <BuildConfigCloneModal
          isModalOpen={isCloneModalOpen}
          toggleModal={toggleCloneModal}
          buildConfig={serviceContainerBuildConfig.data!}
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerBuildConfig() {
  return useOutletContext<ContextType>();
}
