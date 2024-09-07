import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Popover,
} from '@patternfly/react-core';

import { SSHCredentials } from 'pnc-api-types-ts';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ProgressButton } from 'components/ProgressButton/ProgressButton';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

export enum BUILD_STATUS {
  InProgress,
  Success,
  Failed,
}

interface ISshCredentialsButtonProps {
  serviceContainerSshCredentials: IServiceContainerState<SSHCredentials>;
  buildBelongToCurrentUser: boolean;
  buildStatus: BUILD_STATUS;
}

export const SshCredentialsButton = ({
  serviceContainerSshCredentials,
  buildBelongToCurrentUser,
  buildStatus,
}: ISshCredentialsButtonProps) => {
  const disabledReason = !buildBelongToCurrentUser
    ? 'Only user who executed the build and PNC admins are allowed to get the SSH Credentials.'
    : buildStatus === BUILD_STATUS.InProgress
    ? 'The build is currently in progress; SSH Credentials are only available for unsuccessful builds with "keep pod alive" option.'
    : buildStatus === BUILD_STATUS.Success
    ? 'SSH Credentials are only available for unsuccessful builds with "keep pod alive" option.'
    : !serviceContainerSshCredentials.data?.command
    ? "SSH credentials are only available for unsuccessful builds with 'keep pod alive' option. Alternatively you can modify your build script to intentionally fail it and get the SSH credentials you need."
    : undefined;

  return (
    <ProtectedComponent>
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
        <TooltipWrapper tooltip={disabledReason}>
          <ProgressButton
            variant="tertiary"
            isSmall
            serviceContainer={serviceContainerSshCredentials}
            isDisabled={!!disabledReason || !!serviceContainerSshCredentials.error}
          >
            SSH Credentials
          </ProgressButton>
        </TooltipWrapper>
      </Popover>
    </ProtectedComponent>
  );
};
