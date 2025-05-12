import { AnalyzedArtifact } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedAnalyzedArtifact extends AnalyzedArtifact {
  'artifact.id': any;
  'artifact.identifier': any;
  'artifact.targetRepository.repositoryType': any;
  'artifact.buildCategory': any;
  'artifact.filename': any;
  'artifact.artifactQuality': any;
  'artifact.md5': any;
  'artifact.sha1': any;
  'artifact.sha256': any;
  'artifact.build': any;
  'distribution.distributionUrl': any;
  'distribution.md5': any;
  'distribution.sha1': any;
  'distribution.sha256': any;
}

export const analyzedArtifactEntityAttributes = {
  builtFromSource: {
    id: 'builtFromSource',
    title: 'Built From Source',
    values: ['TRUE', 'FALSE'],
    filter: {
      operator: '==',
      isToggleable: true,
    },
  },
  brewId: {
    id: 'brewId',
    title: 'Brew ID',
    filter: { operator: '==' },
  },

  'artifact.id': {
    id: 'artifact.id',
    title: 'ID',
    filter: { operator: '==' },
  },
  'artifact.identifier': {
    id: 'artifact.identifier',
    title: 'Identifier',
    filter: { operator: '=like=' },
    sort: {},
  },
  'artifact.targetRepository.repositoryType': {
    id: 'artifact.targetRepository.repositoryType',
    title: 'Repository Type',
    values: artifactEntityAttributes['targetRepository.repositoryType'].values,
    filter: { operator: '==' },
    sort: {},
  },
  'artifact.buildCategory': {
    id: 'artifact.buildCategory',
    title: 'Build Category',
    values: artifactEntityAttributes.buildCategory.values,
    filter: { operator: '==' },
    sort: {},
  },
  'artifact.filename': {
    id: 'artifact.filename',
    title: 'Filename',
    filter: { operator: '=like=' },
    sort: {},
  },
  'artifact.artifactQuality': {
    id: 'artifact.artifactQuality',
    title: 'Artifact Quality',
    values: artifactEntityAttributes.artifactQuality.values,
    filter: { operator: '==' },
    sort: {},
  },
  'artifact.md5': {
    id: 'artifact.md5',
    title: 'md5',
    filter: { operator: '=like=' },
  },
  'artifact.sha1': {
    id: 'artifact.sha1',
    title: 'sha1',
    filter: { operator: '=like=' },
  },
  'artifact.sha256': {
    id: 'artifact.sha256',
    title: 'sha256',
    filter: { operator: '=like=' },
  },
  'artifact.build': {
    id: 'artifact.build',
    title: 'Build',
  },
  'distribution.distributionUrl': {
    id: 'distribution.distributionUrl',
    title: 'Distribution URL',
  },
  'distribution.md5': {
    id: 'distribution.md5',
    title: 'Distribution MD5',
    filter: { operator: '=like=' },
  },
  'distribution.sha1': {
    id: 'distribution.sha1',
    title: 'Distribution SHA1',
    filter: { operator: '=like=' },
  },
  'distribution.sha256': {
    id: 'distribution.sha256',
    title: 'Distribution SHA256',
    filter: { operator: '=like=' },
  },
} as const satisfies TEntityAttributes<IExtendedAnalyzedArtifact>;
