import { useEffect, useMemo } from 'react';

import { buildStatusData } from 'common/buildStatusData';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { OldUiContentLinkBox } from 'components/OldUiContentLinkBox/OldUiContentLinkBox';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SshCredentialsButton } from 'components/SshCredentialsButton/SshCredentialsButton';

import * as buildApi from 'services/buildApi';
import { userService } from 'services/userService';

export const BuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();
  const isBuilding = useMemo(() => serviceContainerBuild.data?.status === 'BUILDING', [serviceContainerBuild.data?.status]);

  const serviceContainerBuildLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerBuildLogRunner = serviceContainerBuildLog.run;

  const serviceContainerBuildSshCredentials = useServiceContainer(buildApi.getSshCredentials);
  const serviceContainerBuildSshCredentialsRunner = serviceContainerBuildSshCredentials.run;

  const buildBelongToCurrentUser = useMemo(
    () => userService.getUserId() === serviceContainerBuild.data?.user?.id,
    [serviceContainerBuild.data]
  );
  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerBuildLogRunner, buildId, isBuilding]);

  useEffect(() => {
    if (
      buildBelongToCurrentUser &&
      serviceContainerBuild.data?.status &&
      buildStatusData[serviceContainerBuild.data.status].failed
    ) {
      serviceContainerBuildSshCredentialsRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerBuildSshCredentialsRunner, buildId, buildBelongToCurrentUser, serviceContainerBuild.data?.status]);

  const logActions = [
    <SshCredentialsButton
      key="ssh-credentials"
      serviceContainerSshCredentials={serviceContainerBuildSshCredentials}
      buildBelongToCurrentUser={buildBelongToCurrentUser}
      hasBuildFailed={!!serviceContainerBuild.data?.status && !!buildStatusData[serviceContainerBuild.data.status].failed}
    />,
    <BuildLogLink key="log-link" buildId={buildId!} />,
  ];

  return (
    <>
      {!isBuilding && (
        <ServiceContainerLoading {...serviceContainerBuildLog} allowEmptyData title="Build Log">
          <ContentBox padding>
            <LogViewer isStatic data={logData} customActions={logActions} />
          </ContentBox>
        </ServiceContainerLoading>
      )}

      {isBuilding && <OldUiContentLinkBox contentTitle="Build in Progress Log" route={`builds/${buildId}`} />}
    </>
  );
};
