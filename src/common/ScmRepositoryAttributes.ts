export const ScmRepositoryAttributes = {
  internalUrl: {
    title: 'Internal SCM URL',
    tooltip: 'URL to the internal SCM repository, which is the main repository used for the builds.',
  },
  externalUrl: {
    title: 'External SCM URL',
    tooltip: 'URL to the upstream SCM repository.',
  },
  preBuildSyncEnabled: {
    title: 'Pre-build Synchronization',
    tooltip:
      'Option declaring whether the synchronization (for example adding new commits) from the external repository to the internal repository should happen before each build.',
  },
};
