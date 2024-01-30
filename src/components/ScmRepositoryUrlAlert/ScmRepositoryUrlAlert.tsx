import {
  Alert,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { isBoolean } from 'lodash';

import { SCMRepository } from 'pnc-api-types-ts';

interface IScmRepositoryUrlAlertProps {
  variant: 'synced' | 'not-synced';
  internalUrl?: SCMRepository['internalUrl'];
  externalUrl?: SCMRepository['externalUrl'];
  preBuildSyncEnabled?: SCMRepository['preBuildSyncEnabled'];
}

export const ScmRepositoryUrlAlert = ({
  variant,
  internalUrl,
  externalUrl,
  preBuildSyncEnabled,
}: IScmRepositoryUrlAlertProps) => {
  if (variant === 'not-synced') {
    return <Alert variant="info" isInline title="This repository is not synced yet." />;
  }

  return (
    <Alert variant="info" isInline title="This external repository is already synced.">
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
