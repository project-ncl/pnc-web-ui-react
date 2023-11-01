import { BuildPushResult } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const buildPushResultEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  status: {
    id: 'status',
    title: 'Status',
  },
  buildId: {
    id: 'buildId',
    title: 'Build ID',
  },
  brewBuildId: {
    id: 'brewBuildId',
    title: 'Brew Build ID',
  },
  brewBuildUrl: {
    id: 'brewBuildUrl',
    title: 'Brew Build URL',
  },
} as const satisfies TEntityAttributes<BuildPushResult>;
