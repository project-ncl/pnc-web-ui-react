import { BuildPushParameters } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const buildPushParametersEntityAttributes = {
  tagPrefix: {
    id: 'tagPrefix',
    title: 'Brew Tag Prefix',
    tooltip:
      "The Brew tag prefix entered will have '-candidate' appended to it, all Artifacts pushed to Brew will be added to this tag.",
  },
} as const satisfies TEntityAttributes<BuildPushParameters>;
