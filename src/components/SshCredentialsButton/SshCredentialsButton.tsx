import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Popover,
} from '@patternfly/react-core';

import { SSHCredentials } from 'pnc-api-types-ts';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ProtectedProgressButton } from 'components/ProgressButton/ProgressButton';

export enum BUILD_STATUS {
  InProgress,
  Success,
  Failed,
}

interface ISshCredentialsButtonProps {
  serviceContainerSshCredentials: IServiceContainerState<SSHCredentials>;
  buildBelongToCurrentUser: boolean;
  buildStatus: BUILD_STATUS;
  areSshCredentialsUnavailable?: boolean;
}

export const SshCredentialsButton = ({
  serviceContainerSshCredentials,
  buildBelongToCurrentUser,
  buildStatus,
  areSshCredentialsUnavailable = false,
}: ISshCredentialsButtonProps) => {
  const disabledReason = areSshCredentialsUnavailable
    ? 'SSH credentials are no longer provided. Contact a PNC admin. A PNC admin can connect to the pod only if the "keep pod alive" option was used when starting the build and the build failed.'
    : !buildBelongToCurrentUser
    ? 'Only user who executed the build and PNC admins are allowed to get the SSH Credentials.'
    : buildStatus === BUILD_STATUS.InProgress
    ? 'The build is currently in progress; SSH Credentials are only available for unsuccessful builds with "keep pod alive" option.'
    : buildStatus === BUILD_STATUS.Success
    ? 'SSH Credentials are only available for unsuccessful builds with "keep pod alive" option.'
    : !serviceContainerSshCredentials.data?.command
    ? "SSH credentials are only available for unsuccessful builds with 'keep pod alive' option. Alternatively you can modify your build script to intentionally fail it and get the SSH credentials you need."
    : undefined;

  const button = (
    <ProtectedProgressButton
      variant="secondary"
      isSmall
      serviceContainer={serviceContainerSshCredentials}
      isDisabled={!!disabledReason || !!serviceContainerSshCredentials.error}
      disabledTooltip={disabledReason}
    >
      SSH Credentials
    </ProtectedProgressButton>
  );

  if (disabledReason) {
    return button;
  }

  return (
    <Popover
      position="bottom"
      bodyContent={
        <DescriptionList isHorizontal isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>command:</DescriptionListTerm>
            <DescriptionListDescription>{serviceContainerSshCredentials.data?.command}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>password:</DescriptionListTerm>
            <DescriptionListDescription>{serviceContainerSshCredentials.data?.password}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      }
    >
      {button}
    </Popover>
  );
};
