import { Build, BuildConfiguration } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const buildTypeValues: BuildConfiguration['buildType'][] = ['MVN', 'NPM', 'GRADLE', 'SBT'];

interface IExtendedBuildConfig extends BuildConfiguration {
  buildStatus: Build['status'];
  actions: any;
  'project.name': string;
}

export const buildConfigEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  name: {
    id: 'name',
    title: 'Name',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  description: {
    id: 'description',
    title: 'Description',
  },
  buildType: {
    id: 'buildType',
    title: 'Build Type',
    values: buildTypeValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  'project.name': {
    id: 'project.name',
    title: 'Project',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  creationTime: {
    id: 'creationTime',
    title: 'Created',
    sort: {
      group: 'times',
    },
  },
  modificationTime: {
    id: 'modificationTime',
    title: 'Modified',
    sort: {
      group: 'times',
    },
  },
  buildStatus: {
    id: 'buildStatus',
    title: 'Latest Build Status',
  },
  actions: {
    id: 'actions',
    title: 'Actions',
  },
} as const satisfies TEntityAttributes<IExtendedBuildConfig>;
