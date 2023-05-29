import { SCMRepository } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

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
    title: 'Pre-build Synchronization',
    tooltip:
      'Option declaring whether the synchronization (for example adding new commits) from the external repository to the internal repository should happen before each build.',
  },
} as const satisfies IEntityAttributes<SCMRepository>;
