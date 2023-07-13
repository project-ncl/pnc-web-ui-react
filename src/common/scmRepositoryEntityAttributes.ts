import { SCMRepository } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedSCMRepository extends SCMRepository {
  name: string;
  scmUrl: string;
}

export const scmRepositoryEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  name: {
    id: 'name',
    title: 'Name',
    tooltip: 'SCM Repository name generated from its Internal SCM URL.',
  },
  scmUrl: {
    id: 'scmUrl',
    title: 'SCM Repository URL',
    tooltip: 'The URL of the SCM to be created, this can be either an internal or external URL.',
  },
  internalUrl: {
    id: 'internalUrl',
    title: 'Internal SCM URL',
    tooltip: 'URL to the internal SCM repository, which is the main repository used for the builds.',
    filter: {
      operator: '=like=',
    },
  },
  externalUrl: {
    id: 'externalUrl',
    title: 'External SCM URL',
    tooltip: 'URL to the upstream SCM repository.',
    filter: {
      operator: '=like=',
    },
  },
  preBuildSyncEnabled: {
    id: 'preBuildSyncEnabled',
    title: 'Pre-build Sync',
    tooltip:
      'Option declaring whether the synchronization (for example adding new commits) from the external repository to the internal repository should happen before each build.',
  },
} as const satisfies TEntityAttributes<IExtendedSCMRepository>;
