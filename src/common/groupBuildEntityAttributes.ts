import { GroupBuild } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const statusValues: GroupBuild['status'][] = [
  'SUCCESS',
  'FAILED',
  'NO_REBUILD_REQUIRED',
  'ENQUEUED',
  'WAITING_FOR_DEPENDENCIES',
  'BUILDING',
  'REJECTED',
  'REJECTED_FAILED_DEPENDENCIES',
  'CANCELLED',
  'SYSTEM_ERROR',
  'NEW',
];

interface IExtendedGroupBuild extends GroupBuild {
  'groupConfig.name': string; // filtering only
  name: any; // derived from build and groupConfig
  'user.username': any;
}

export const groupBuildEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  name: {
    id: 'name',
    title: 'Name',
  },
  status: {
    id: 'status',
    title: 'Status',
    values: statusValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  'groupConfig.name': {
    id: 'groupConfig.name',
    title: 'Group Config name',
    filter: {
      operator: '=like=',
    },
  },
  startTime: {
    id: 'startTime',
    title: 'Started',
    sort: {
      group: 'times',
    },
  },
  endTime: {
    id: 'endTime',
    title: 'Ended',
    sort: {
      group: 'times',
    },
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  temporaryBuild: {
    id: 'temporaryBuild',
    title: 'Temporary Build',
    values: ['TRUE', 'FALSE'],
    filter: {
      operator: '==',
    },
  },
} as const satisfies TEntityAttributes<IExtendedGroupBuild>;
