import { Artifact, Build, TargetRepository } from 'pnc-api-types-ts';

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
  'targetRepository.repositoryType': any;
  'product.name': any;
  'productMilestone.version': any;
  build: Build;
}

export const artifactEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  identifier: {
    id: 'identifier',
    title: 'Identifier',
    filter: {
      operator: '=like=',
    },
  },
  artifactQuality: {
    id: 'artifactQuality',
    title: 'Artifact Quality',
    values: artifactQualityValues,
    filter: {
      operator: '==',
    },
  },
  buildCategory: {
    id: 'buildCategory',
    title: 'Build Category',
    values: buildCategoryValues,
    filter: {
      operator: '==',
    },
  },
  filename: {
    id: 'filename',
    title: 'Filename',
    filter: {
      operator: '=like=',
    },
  },
  'targetRepository.repositoryType': {
    id: 'targetRepository.repositoryType',
    title: 'Repository Type',
    values: repositoryTypeValues,
    filter: {
      operator: '==',
    },
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
  },
  'productMilestone.version': {
    id: 'productMilestone.version',
    title: 'Milestone Version',
    filter: {
      operator: '=like=',
    },
  },
  build: {
    id: 'build',
    title: 'Build',
  },
} as const satisfies TEntityAttributes<IExtendedArtifact>;
