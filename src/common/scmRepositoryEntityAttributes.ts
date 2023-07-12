import { SCMRepository } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const scmRepositoryEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
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
} as const satisfies TEntityAttributes<SCMRepository>;
