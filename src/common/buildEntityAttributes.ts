import { Build } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { TEntityAttributes } from 'common/entityAttributes';

const statusValues: Build['status'][] = [
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

interface IExtendedBuild extends Build {
  buildConfigName: any; // filtering only
  name: any; // derived from build and buildConfig
  'user.username': any;
  'buildConfigRevision.buildType': string; // from buildConfigEntityAttributes
  'buildConfigRevision.scmRevision': string;
  scmBuildConfigRevision: string; // not released yet
  'environment.description': string;
  'buildConfigRevision.buildScript': string;
  'buildConfigRevision.brewPullActive': boolean;
  parameters: any;
}

export const buildEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
    tooltip: 'Unique identification of Build.',
    filter: {
      operator: '==',
    },
  },
  buildConfigName: {
    id: 'buildConfigName',
    title: 'Build Config',
    filter: {
      operator: '=like=',
      isCustomParam: true,
    },
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
  temporaryBuild: {
    id: 'temporaryBuild',
    title: 'Temporary Build',
    values: ['TRUE', 'FALSE'],
    filter: {
      operator: '==',
      isToggleable: true,
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
  name: {
    id: 'name',
    title: 'Name',
    tooltip: `Human readable title for Build derived from Build submitted and Build Config name. Uniqueness is not guaranteed, see ID instead.`,
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submitted',
    sort: {
      group: 'times',
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
  'buildConfigRevision.buildType': { ...buildConfigEntityAttributes.buildType, id: 'buildConfigRevision.buildType' },
  scmUrl: {
    id: 'scmUrl',
    title: 'SCM URL',
  },
  'buildConfigRevision.scmRevision': {
    id: 'buildConfigRevision.scmRevision',
    title: 'Pre-alignment SCM Ref',
    tooltip:
      'SCM Ref before Alignment is executed (the revision specified in the Build Config, previously named as Pre-alignment SCM Revision).',
  },
  scmBuildConfigRevision: {
    id: 'scmBuildConfigRevision',
    title: 'Pre-alignment SCM Revision',
    tooltip: 'SCM Revision before Alignment is executed (the commit ID resolved from the Pre-alignment SCM Ref).',
  },
  scmTag: {
    id: 'scmTag',
    title: 'Post-alignment SCM Tag',
    tooltip: 'SCM Tag after Alignment is executed (the tag created from PNC).',
  },
  scmRevision: {
    id: 'scmRevision',
    title: 'Post-alignment SCM Revision',
    tooltip: 'SCM Revision after Alignment is executed (the commit ID resolved from the Post-alignment SCM Tag).',
  },
  'environment.description': {
    id: 'environment.description',
    title: 'Environment',
  },
  'buildConfigRevision.buildScript': {
    id: 'buildConfigRevision.buildScript',
    title: 'Build Script',
  },
  attributes: {
    id: 'attributes',
    title: 'Attributes',
  },
  'buildConfigRevision.brewPullActive': {
    id: 'buildConfigRevision.brewPullActive',
    title: 'Brew Pull Active',
  },
  parameters: {
    id: 'parameters',
    title: 'Parameters',
  },
} as const satisfies TEntityAttributes<IExtendedBuild>;
