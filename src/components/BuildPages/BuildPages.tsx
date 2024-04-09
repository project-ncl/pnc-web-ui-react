import { useCallback, useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { Build } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BrewPushModal } from 'components/BrewPushModal/BrewPushModal';
import { BrewPushModalButton } from 'components/BrewPushModal/BrewPushModalButton';
import { calculateLongBuildName } from 'components/BuildName/BuildName';
import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { CancelBuildModal } from 'components/CancelBuildModal/CancelBuildModal';
import { CancelBuildModalButton } from 'components/CancelBuildModal/CancelBuildModalButton';
import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerBuild: IServiceContainerState<Build> };

export const BuildPages = () => {
  const { buildId } = useParamsRequired();

  const serviceContainerBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerBuildRunner = serviceContainerBuild.run;
  const serviceContainerBuildSetter = serviceContainerBuild.setData;

  const serviceContainerArtifacts = useServiceContainer(buildApi.getBuiltArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const serviceContainerDependencies = useServiceContainer(buildApi.getDependencies);
  const serviceContainerDependenciesRunner = serviceContainerDependencies.run;

  const [isBrewPushModalOpen, setIsBrewPushModalOpen] = useState<boolean>(false);
  const [isCancelBuildModalOpen, setIsCancelBuildModalOpen] = useState<boolean>(false);

  const toggleBewPushModal = () => setIsBrewPushModalOpen((isBrewPushModalOpen) => !isBrewPushModalOpen);
  const toggleCancelBuildModal = () => setIsCancelBuildModalOpen((isCancelBuildModalOpen) => !isCancelBuildModalOpen);

  useEffect(() => {
    serviceContainerBuildRunner({ serviceData: { id: buildId } });

    serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerDependenciesRunner({ serviceData: { id: buildId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [serviceContainerBuildRunner, serviceContainerArtifactsRunner, serviceContainerDependenciesRunner, buildId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStatusChanged(wsData, { buildId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildSetter(wsBuild);
        }
      },
      [serviceContainerBuildSetter, buildId]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerBuild,
      firstLevelEntity: 'Build',
      entityName: (serviceContainerBuild.data && calculateLongBuildName(serviceContainerBuild.data)) || undefined,
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="build-log">Build Log</PageTabsItem>
      <PageTabsItem url="alignment-log">Alignment Log</PageTabsItem>
      <PageTabsItem url="artifacts">
        Artifacts{' '}
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="dependencies">
        Dependencies{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependencies} title="Dependencies Count">
          {serviceContainerDependencies.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="brew-push">Brew Push</PageTabsItem>
      <PageTabsItem url="build-metrics">Build Metrics</PageTabsItem>
      <ExperimentalContent>
        <PageTabsItem url="artifact-dependency-graph">
          <ExperimentalContentMarker dataSource="mock" contentType="text" showTooltip>
            Artifact Dependency Graph
          </ExperimentalContentMarker>
        </PageTabsItem>
      </ExperimentalContent>
    </PageTabs>
  );

  const actions = [
    <CancelBuildModalButton
      key="cancel-build-button"
      toggleModal={toggleCancelBuildModal}
      build={serviceContainerBuild.data!}
      variant="Build"
    />,
    <BrewPushModalButton key="brew-push-button" toggleModal={toggleBewPushModal} build={serviceContainerBuild.data!} />,
  ];

  return (
    <ServiceContainerLoading {...serviceContainerBuild} title="Build details">
      <PageLayout
        title={<BuildStatus build={serviceContainerBuild.data!} long hideDatetime hideUsername />}
        breadcrumbs={[{ entity: breadcrumbData.build.id, title: serviceContainerBuild.data?.id }]}
        tabs={pageTabs}
        actions={actions}
      >
        <Outlet context={{ serviceContainerBuild }} />
      </PageLayout>

      {isBrewPushModalOpen && (
        <BrewPushModal
          isModalOpen={isBrewPushModalOpen}
          toggleModal={toggleBewPushModal}
          build={serviceContainerBuild.data!}
          variant="Build"
        />
      )}

      {isCancelBuildModalOpen && (
        <CancelBuildModal
          isModalOpen={isCancelBuildModalOpen}
          toggleModal={toggleCancelBuildModal}
          build={serviceContainerBuild.data!}
          variant="Build"
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerBuild() {
  return useOutletContext<ContextType>();
}
