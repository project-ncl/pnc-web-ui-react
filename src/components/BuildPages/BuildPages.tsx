import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { Build } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { buildStatusData } from 'common/buildStatusData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildFinished, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
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
import { BUILD_STATUS, SshCredentialsButton } from 'components/SshCredentialsButton/SshCredentialsButton';

import * as buildApi from 'services/buildApi';
import { uiLogger } from 'services/uiLogger';
import { userService } from 'services/userService';

import { generatePageTitle } from 'utils/titleHelper';
import { isBuildWithLog } from 'utils/utils';

type ContextType = { serviceContainerBuild: IServiceContainerState<Build>; isBuilding: boolean };

export const BuildPages = () => {
  const { buildId } = useParamsRequired();

  const serviceContainerBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerBuildRunner = serviceContainerBuild.run;
  const serviceContainerBuildSetter = serviceContainerBuild.setData;

  const serviceContainerArtifacts = useServiceContainer(buildApi.getBuiltArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const serviceContainerDependencies = useServiceContainer(buildApi.getDependencies);
  const serviceContainerDependenciesRunner = serviceContainerDependencies.run;

  const serviceContainerBuildSshCredentials = useServiceContainer(buildApi.getSshCredentials);
  const serviceContainerBuildSshCredentialsRunner = serviceContainerBuildSshCredentials.run;

  const [isBrewPushModalOpen, setIsBrewPushModalOpen] = useState<boolean>(false);
  const [isCancelBuildModalOpen, setIsCancelBuildModalOpen] = useState<boolean>(false);

  const toggleBewPushModal = () => setIsBrewPushModalOpen((isBrewPushModalOpen) => !isBrewPushModalOpen);
  const toggleCancelBuildModal = () => setIsCancelBuildModalOpen((isCancelBuildModalOpen) => !isCancelBuildModalOpen);

  const isBuilding = useMemo(() => serviceContainerBuild.data?.status === 'BUILDING', [serviceContainerBuild.data?.status]);

  const buildBelongToCurrentUser = useMemo(
    () => userService.getUserId() === serviceContainerBuild.data?.user?.id,
    [serviceContainerBuild.data]
  );

  const isCurrentUserAdmin = useMemo(() => userService.isAdminUser(), []);

  useEffect(() => {
    serviceContainerBuildRunner({ serviceData: { id: buildId } });

    serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerDependenciesRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
  }, [serviceContainerBuildRunner, serviceContainerArtifactsRunner, serviceContainerDependenciesRunner, buildId]);

  useEffect(() => {
    if (
      (buildBelongToCurrentUser || isCurrentUserAdmin) &&
      serviceContainerBuild.data?.status &&
      buildStatusData[serviceContainerBuild.data.status].failed
    ) {
      serviceContainerBuildSshCredentialsRunner({ serviceData: { id: buildId } }).catch((error) => {
        if (error.response && error.response.status === 403) {
          uiLogger.error('403 Forbidden: The endpoint blocked your access to SSH credentials of this build.');
        } else {
          throw error;
        }
      });
    }
  }, [
    serviceContainerBuildSshCredentialsRunner,
    buildId,
    buildBelongToCurrentUser,
    serviceContainerBuild.data?.status,
    isCurrentUserAdmin,
  ]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildFinished(wsData, { buildId })) {
          serviceContainerBuildRunner({ serviceData: { id: buildId } });

          serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
          serviceContainerDependenciesRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
        } else if (hasBuildStatusChanged(wsData, { buildId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildSetter(wsBuild);
        }
      },
      [
        serviceContainerBuildRunner,
        serviceContainerBuildSetter,
        serviceContainerArtifactsRunner,
        serviceContainerDependenciesRunner,
        buildId,
      ]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerBuild,
      firstLevelEntity: 'Build',
      entityName: (serviceContainerBuild.data && calculateLongBuildName(serviceContainerBuild.data)) || undefined,
    })
  );

  const isLogged = !serviceContainerBuild.data?.status || isBuildWithLog(serviceContainerBuild.data.status);
  const isLoggedTooltip = !isLogged ? `Builds with status ${serviceContainerBuild.data!.status} are not logged.` : '';
  const liveLogLinkTooltip = !isBuilding ? `Build is not in progress.` : '';
  const staticDataTooltip = isBuilding ? `Build is not finished yet.` : '';

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="live-log" isDisabled={!isLogged || !isBuilding} tooltip={isLoggedTooltip || liveLogLinkTooltip}>
        Live Log
      </PageTabsItem>
      <PageTabsItem url="build-log" isDisabled={!isLogged || isBuilding} tooltip={isLoggedTooltip || staticDataTooltip}>
        Build Log
      </PageTabsItem>
      <PageTabsItem url="alignment-log" isDisabled={!isLogged || isBuilding} tooltip={isLoggedTooltip || staticDataTooltip}>
        Alignment Log
      </PageTabsItem>
      <PageTabsItem url="artifacts" isDisabled={isBuilding} tooltip={staticDataTooltip}>
        Artifacts{' '}
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="dependencies" isDisabled={isBuilding} tooltip={staticDataTooltip}>
        Dependencies{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependencies} title="Dependencies Count">
          {serviceContainerDependencies.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="brew-push" isDisabled={isBuilding} tooltip={staticDataTooltip}>
        Brew Push
      </PageTabsItem>
      <PageTabsItem url="build-metrics">Build Metrics</PageTabsItem>
      <ExperimentalContent>
        <PageTabsItem url="artifact-dependency-graph" isDisabled={isBuilding} tooltip={staticDataTooltip}>
          <ExperimentalContentMarker dataSource="mock" contentType="text" showTooltip>
            Artifact Dependency Graph
          </ExperimentalContentMarker>
        </PageTabsItem>
      </ExperimentalContent>
    </PageTabs>
  );

  const actions = [
    <SshCredentialsButton
      key="ssh-credentials"
      serviceContainerSshCredentials={serviceContainerBuildSshCredentials}
      buildBelongToCurrentUser={buildBelongToCurrentUser || isCurrentUserAdmin}
      buildStatus={
        !serviceContainerBuild.data?.status
          ? BUILD_STATUS.InProgress
          : buildStatusData[serviceContainerBuild.data.status].failed
          ? BUILD_STATUS.Failed
          : buildStatusData[serviceContainerBuild.data.status].progress !== 'FINISHED'
          ? BUILD_STATUS.InProgress
          : BUILD_STATUS.Success
      }
    />,
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
        title={<BuildStatus build={serviceContainerBuild.data!} long hideDatetime hideUsername includeConfigLink />}
        breadcrumbs={[{ entity: breadcrumbData.build.id, title: serviceContainerBuild.data?.id }]}
        tabs={pageTabs}
        actions={actions}
      >
        <Outlet context={{ serviceContainerBuild, isBuilding }} />
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
