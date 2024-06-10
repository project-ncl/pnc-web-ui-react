import {
  Alert,
  AlertProps,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { SCMRepository } from 'pnc-api-types-ts';

import { isBoolean } from 'utils/entityRecognition';

interface IScmRepositoryUrlAlertProps {
  variant: 'synced' | 'not-synced';
  alertLevel?: AlertProps['variant'];
  internalUrl?: SCMRepository['internalUrl'];
  externalUrl?: SCMRepository['externalUrl'];
  preBuildSyncEnabled?: SCMRepository['preBuildSyncEnabled'];
}

export const ScmRepositoryUrlAlert = ({
  variant,
  alertLevel = 'info',
  internalUrl,
  externalUrl,
  preBuildSyncEnabled,
}: IScmRepositoryUrlAlertProps) => {
  if (variant === 'not-synced') {
    return <Alert variant={alertLevel} isInline title="This repository is not synced yet." />;
  }

  return (
    <Alert variant={alertLevel} isInline title="This external repository is already synced.">
      <DescriptionList isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Internal URL</DescriptionListTerm>
          <DescriptionListDescription>{internalUrl}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>External URL</DescriptionListTerm>
          <DescriptionListDescription>{externalUrl}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Pre-build sync</DescriptionListTerm>
          <DescriptionListDescription>
            {isBoolean(preBuildSyncEnabled) && (preBuildSyncEnabled ? 'enabled' : 'disabled')}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Alert>
  );
};
