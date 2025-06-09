import { BuildPushReport } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

export const buildPushReportEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  build: {
    id: 'build',
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
} as const satisfies TEntityAttributes<BuildPushReport>;
