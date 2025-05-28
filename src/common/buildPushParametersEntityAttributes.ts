import { BuildPushParameters } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const buildPushParametersEntityAttributes = {
  tagPrefix: {
    id: 'tagPrefix',
    title: 'Brew Tag Prefix',
    tooltip:
      "The Brew tag prefix entered will have '-candidate' appended to it, all Artifacts pushed to Brew will be added to this tag.",
  },
  reimport: {
    id: 'reimport',
    title: 'Reimport',
    tooltip:
      'When enabled, and if this Build is already present in Brew, it will import this Build as a new Brew build with an incremented revision.',
  },
} as const satisfies TEntityAttributes<BuildPushParameters>;
