import { Artifact, Build, ProductMilestone, TargetRepository } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const artifactQualityValues: Artifact['artifactQuality'][] = [
  'NEW',
  'VERIFIED',
  'TESTED',
  'DEPRECATED',
  'BLACKLISTED',
  'TEMPORARY',
  'DELETED',
  'IMPORTED',
];

const buildCategoryValues: Artifact['buildCategory'][] = ['STANDARD', 'SERVICE'];

const repositoryTypeValues: TargetRepository['repositoryType'][] = [
  'MAVEN',
  'GENERIC_PROXY',
  'NPM',
  'COCOA_POD',
  'DISTRIBUTION_ARCHIVE',
];

interface IExtendedArtifact extends Artifact {
  'targetRepository.identifier': any;
  'targetRepository.repositoryType': any;
  'targetRepository.temporaryRepo': any;
  'targetRepository.repositoryPath': any;
  'product.name': any;
  'productMilestone.version': any;
  build: Build;
  'build.productMilestone': ProductMilestone;
  'build.productMilestone.id': string;
  'build.productMilestone.productVersion.id': string;
  'build.productMilestone.productVersion.product.id': string;
}

export const artifactEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
    filter: {
      operator: '==',
    },
  },
  identifier: {
    id: 'identifier',
    title: 'Identifier',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  artifactQuality: {
    id: 'artifactQuality',
    title: 'Artifact Quality',
    values: artifactQualityValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  buildCategory: {
    id: 'buildCategory',
    title: 'Build Category',
    values: buildCategoryValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  filename: {
    id: 'filename',
    title: 'Filename',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  'targetRepository.identifier': {
    id: 'targetRepository.identifier',
    title: 'Identifier',
  },
  'targetRepository.repositoryType': {
    id: 'targetRepository.repositoryType',
    title: 'Repository Type',
    values: repositoryTypeValues,
    filter: {
      operator: '==',
    },
    sort: {},
  },
  'targetRepository.temporaryRepo': {
    id: 'targetRepository.temporaryRepo',
    title: 'Temporary',
  },
  'targetRepository.repositoryPath': {
    id: 'targetRepository.repositoryPath',
    title: 'Repository Path',
  },
  md5: {
    id: 'md5',
    title: 'md5',
    filter: {
      operator: '=like=',
    },
  },
  sha1: {
    id: 'sha1',
    title: 'sha1',
    filter: {
      operator: '=like=',
    },
  },
  sha256: {
    id: 'sha256',
    title: 'sha256',
    filter: {
      operator: '=like=',
    },
  },
  'product.name': {
    id: 'product.name',
    title: 'Product Name',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  'productMilestone.version': {
    id: 'productMilestone.version',
    title: 'Milestone Version',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  build: {
    id: 'build',
    title: 'Build',
  },
  'build.productMilestone': {
    id: 'build.productMilestone',
    title: 'Build Milestone',
    filter: {
      operator: '==',
    },
  },
  'build.productMilestone.id': {
    id: 'build.productMilestone.id',
    title: 'Build Milestone ID',
    filter: {
      operator: '==',
    },
  },
  'build.productMilestone.productVersion.id': {
    id: 'build.productMilestone.productVersion.id',
    title: 'Build Version ID',
    filter: {
      operator: '==',
    },
  },
  'build.productMilestone.productVersion.product.id': {
    id: 'build.productMilestone.productVersion.product.id',
    title: 'Build Product ID',
    filter: {
      operator: '==',
    },
  },
  purl: {
    id: 'purl',
    title: 'Package URL',
  },
  size: {
    id: 'size',
    title: 'Size',
  },
  importDate: {
    id: 'importDate',
    title: 'Import Date',
  },
  publicUrl: {
    id: 'publicUrl',
    title: 'Public URL',
    tooltip: 'Download URL of the Artifact.',
  },
  originUrl: {
    id: 'originUrl',
    title: 'Origin URL',
    tooltip: 'URL to the origin of imported Artifacts. Empty for PNC Artifacts.',
  },
  deployUrl: {
    id: 'deployUrl',
    title: 'Deploy URL',
    tooltip: 'URL to be used in the deployment environment, for example, Openshift.',
  },
} as const satisfies TEntityAttributes<IExtendedArtifact>;
