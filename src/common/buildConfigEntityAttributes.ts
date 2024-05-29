import { Build, BuildConfiguration } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const buildTypeValues: BuildConfiguration['buildType'][] = ['MVN', 'NPM', 'GRADLE', 'SBT'];

interface IExtendedBuildConfig extends BuildConfiguration {
  buildStatus: Build['status'];
  actions: any;
  'environment.deprecated': boolean;
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
  creationUser: {
    id: 'creationUser',
    title: 'Created by',
  },
  modificationUser: {
    id: 'modificationUser',
    title: 'Modified by',
  },
  environment: {
    id: 'environment',
    title: 'Environment',
  },
  'environment.deprecated': {
    id: 'environment.deprecated',
    title: 'Deprecated ENV',
    values: ['TRUE', 'FALSE'],
    filter: {
      operator: '==',
      isToggleable: true,
    },
  },
  scmRepository: {
    id: 'scmRepository',
    title: 'SCM Repository',
  },
  scmRevision: {
    id: 'scmRevision',
    title: 'SCM Revision',
  },
  buildScript: {
    id: 'buildScript',
    title: 'Build Script',
  },
  brewPullActive: {
    id: 'brewPullActive',
    title: 'Brew Pull Active',
    tooltip: 'The option enables to search for built dependencies in Brew as well as in PNC.',
  },
  productVersion: {
    id: 'productVersion',
    title: 'Product Version',
  },
  parameters: {
    id: 'parameters',
    title: 'Parameters',
  },
} as const satisfies TEntityAttributes<IExtendedBuildConfig>;
