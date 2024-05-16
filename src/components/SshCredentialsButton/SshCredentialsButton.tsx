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
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface ISshCredentialsButtonProps {
  serviceContainerSshCredentials: IServiceContainerState<SSHCredentials>;
  buildBelongToCurrentUser: boolean;
  hasBuildFailed: boolean;
}

export const SshCredentialsButton = ({
  serviceContainerSshCredentials,
  buildBelongToCurrentUser,
  hasBuildFailed,
}: ISshCredentialsButtonProps) => {
  const disabledReason = !buildBelongToCurrentUser
    ? 'Build does not belong to the currently logged in user.'
    : !hasBuildFailed
    ? 'Build has not failed.'
    : !serviceContainerSshCredentials.data?.command
    ? "SSH credentials are only available for those unsuccessful builds with 'keep pod alive' option. Alternatively you can modify your build script to intentionally fail it and get the SSH credentials you need."
    : undefined;

  return (
    <Popover
      removeFindDomNode
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
          variant="control"
          serviceContainer={serviceContainerSshCredentials}
          isDisabled={!!disabledReason || !!serviceContainerSshCredentials.error}
        >
          SSH Credentials
        </ProgressButton>
      </TooltipWrapper>
    </Popover>
  );
};
