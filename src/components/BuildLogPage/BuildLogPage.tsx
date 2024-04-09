import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Popover,
} from '@patternfly/react-core';
import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { OldUiContentLinkBox } from 'components/OldUiContentLinkBox/OldUiContentLinkBox';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

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

  const belongsToCurrentUser = useMemo(
    () => userService.getUserId() === serviceContainerBuild.data?.user?.id,
    [serviceContainerBuild.data]
  );
  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
      if (belongsToCurrentUser) {
        serviceContainerBuildSshCredentialsRunner({ serviceData: { id: buildId } });
      }
    }
  }, [serviceContainerBuildLogRunner, serviceContainerBuildSshCredentialsRunner, buildId, belongsToCurrentUser, isBuilding]);

  const logActions = [
    ...(belongsToCurrentUser
      ? [
          <ServiceContainerLoading
            key="ssh-credentials"
            {...serviceContainerBuildSshCredentials}
            variant="icon"
            title="SSH credentials"
          >
            <Popover
              removeFindDomNode
              position="right-end"
              bodyContent={
                <DescriptionList isHorizontal isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>command:</DescriptionListTerm>
                    <DescriptionListDescription>{serviceContainerBuildSshCredentials.data?.command}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>password:</DescriptionListTerm>
                    <DescriptionListDescription>{serviceContainerBuildSshCredentials.data?.password}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              }
            >
              <TooltipWrapper
                tooltip={
                  !serviceContainerBuildSshCredentials.data?.command
                    ? "SSH credentials are only available for those unsuccessful builds with 'keep pod alive' option. Alternatively you can modify your build script to intentionally fail it and get the SSH credentials you need."
                    : undefined
                }
              >
                <Button variant="control" isAriaDisabled={!serviceContainerBuildSshCredentials.data?.command}>
                  SSH Credentials
                </Button>
              </TooltipWrapper>
            </Popover>
          </ServiceContainerLoading>,
        ]
      : []),
    <BuildLogLink buildId={buildId!} />,
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
