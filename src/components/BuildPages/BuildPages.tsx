import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router';

import { ArtifactPage, Build, BuildPushOperationPage } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { buildStatusData } from 'common/buildStatusData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import {
  hasBuildFinished,
  hasBuildPushFinished,
  hasBuildStatusChanged,
  usePncWebSocketEffect,
} from 'hooks/usePncWebSocketEffect';
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
import { isBuildFinished, isBuildWithArtifacts, isBuildWithLiveLog, isBuildWithStaticLog } from 'utils/utils';

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

  const serviceContainerBuildPushes = useServiceContainer(buildApi.getBuildPushes);
  const serviceContainerBuildPushesRunner = serviceContainerBuildPushes.run;

  const [isBrewPushModalOpen, setIsBrewPushModalOpen] = useState<boolean>(false);
  const [isCancelBuildModalOpen, setIsCancelBuildModalOpen] = useState<boolean>(false);

  const toggleBewPushModal = () => setIsBrewPushModalOpen((isBrewPushModalOpen) => !isBrewPushModalOpen);
  const toggleCancelBuildModal = () => setIsCancelBuildModalOpen((isCancelBuildModalOpen) => !isCancelBuildModalOpen);

  const isBuilding = useMemo(() => !isBuildFinished(serviceContainerBuild.data?.status), [serviceContainerBuild.data?.status]);

  useEffect(() => {
    serviceContainerBuildRunner({ serviceData: { id: buildId } });

    serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerDependenciesRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerBuildPushesRunner({ serviceData: { id: buildId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
  }, [
    serviceContainerBuildRunner,
    serviceContainerArtifactsRunner,
    serviceContainerDependenciesRunner,
    serviceContainerBuildPushesRunner,
    buildId,
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
        } else if (hasBuildPushFinished(wsData, { buildId })) {
          serviceContainerBuildPushesRunner({
            serviceData: { id: buildId },
            requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
          });
        }
      },
      [
        serviceContainerBuildRunner,
        serviceContainerBuildSetter,
        serviceContainerArtifactsRunner,
        serviceContainerDependenciesRunner,
        serviceContainerBuildPushesRunner,
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

  const actions = [
    <BuildSshCredentialsButton key="ssh-credentials" serviceContainerBuild={serviceContainerBuild} />,
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
        breadcrumbs={[
          { entity: breadcrumbData.build.id, title: serviceContainerBuild.data?.id },
          { entity: breadcrumbData.buildPush.id, title: serviceContainerBuild.data?.id },
        ]}
        tabs={
          <BuildPageTabs
            build={serviceContainerBuild.data!}
            serviceContainerArtifacts={serviceContainerArtifacts}
            serviceContainerDependencies={serviceContainerDependencies}
            serviceContainerBuildPushes={serviceContainerBuildPushes}
          />
        }
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

interface IBuildPageTabsProps {
  build: Build;
  serviceContainerArtifacts: IServiceContainerState<ArtifactPage>;
  serviceContainerDependencies: IServiceContainerState<ArtifactPage>;
  serviceContainerBuildPushes: IServiceContainerState<BuildPushOperationPage>;
}

const BuildPageTabs = ({
  build,
  serviceContainerArtifacts,
  serviceContainerDependencies,
  serviceContainerBuildPushes,
}: IBuildPageTabsProps) => {
  const hasArtifacts = useMemo(() => isBuildWithArtifacts(build.status), [build.status]);
  const isStaticLogAvailable = useMemo(() => isBuildWithStaticLog(build.status), [build.status]);
  const isLiveLogAvailable = useMemo(() => isBuildWithLiveLog(build.status), [build.status]);

  return (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="live-log" isDisabled={!isLiveLogAvailable.value} tooltip={isLiveLogAvailable.reason}>
        Live Log
      </PageTabsItem>
      <PageTabsItem url="build-log" isDisabled={!isStaticLogAvailable.value} tooltip={isStaticLogAvailable.reason}>
        Build Log
      </PageTabsItem>
      <PageTabsItem url="alignment-log" isDisabled={!isStaticLogAvailable.value} tooltip={isStaticLogAvailable.reason}>
        Alignment Log
      </PageTabsItem>
      <PageTabsItem url="artifacts" isDisabled={!hasArtifacts.value} tooltip={hasArtifacts.reason}>
        Artifacts{' '}
        <PageTabsLabel serviceContainer={serviceContainerArtifacts} title="Artifacts Count">
          {serviceContainerArtifacts.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="dependencies" isDisabled={!hasArtifacts.value} tooltip={hasArtifacts.reason}>
        Dependencies{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependencies} title="Dependencies Count">
          {serviceContainerDependencies.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="build-pushes" isDisabled={!hasArtifacts.value} tooltip={hasArtifacts.reason}>
        Build Pushes{' '}
        <PageTabsLabel serviceContainer={serviceContainerBuildPushes} title="Build Pushes Count">
          {serviceContainerBuildPushes.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="build-metrics">Build Metrics</PageTabsItem>
      <ExperimentalContent>
        <PageTabsItem url="implicit-dependency-graph" isDisabled={!hasArtifacts.value} tooltip={hasArtifacts.reason}>
          <ExperimentalContentMarker dataSource="experimental" contentType="text" showTooltip>
            Implicit Dependency Graph
          </ExperimentalContentMarker>
        </PageTabsItem>
      </ExperimentalContent>
    </PageTabs>
  );
};

interface IBuildSshCredentialsButtonProps {
  serviceContainerBuild: IServiceContainerState<Build>;
}

const BuildSshCredentialsButton = ({ serviceContainerBuild }: IBuildSshCredentialsButtonProps) => {
  const serviceContainerBuildSshCredentials = useServiceContainer(buildApi.getSshCredentials);
  const serviceContainerBuildSshCredentialsRunner = serviceContainerBuildSshCredentials.run;

  const buildBelongToCurrentUser = useMemo(
    () => userService.getUserId() === serviceContainerBuild.data?.user?.id,
    [serviceContainerBuild.data]
  );
  const isCurrentUserAdmin = useMemo(() => userService.isAdminUser(), []);

  const areSshCredentialsUnavailable = useMemo(() => import.meta.env.VITE_SSH_CREDENTIALS_UNAVAILABLE === 'true', []);

  useEffect(() => {
    if (
      areSshCredentialsUnavailable &&
      (buildBelongToCurrentUser || isCurrentUserAdmin) &&
      serviceContainerBuild.data?.status &&
      buildStatusData[serviceContainerBuild.data.status].failed
    ) {
      serviceContainerBuildSshCredentialsRunner({ serviceData: { id: serviceContainerBuild.data.id } }).catch((error) => {
        if (error.response && error.response.status === 403) {
          uiLogger.error('403 Forbidden: The endpoint blocked your access to SSH credentials of this build.');
        } else {
          throw error;
        }
      });
    }
  }, [
    areSshCredentialsUnavailable,
    serviceContainerBuildSshCredentialsRunner,
    serviceContainerBuild.data,
    buildBelongToCurrentUser,
    isCurrentUserAdmin,
  ]);

  return (
    <SshCredentialsButton
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
      areSshCredentialsUnavailable={areSshCredentialsUnavailable}
    />
  );
};
