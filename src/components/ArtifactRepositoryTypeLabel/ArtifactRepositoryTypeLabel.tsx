import { Label } from '@patternfly/react-core';

import { TargetRepository } from 'pnc-api-types-ts';

import { ILabelMapper } from 'components/ArtifactQualityLabel/ArtifactQualityLabel';
import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';

const ARTIFACT_REPOSITORY_TYPES: ILabelMapper = {
  MAVEN: {
    text: 'MAVEN',
    color: 'gold',
  },
  GENERIC_PROXY: {
    text: 'GENERIC_PROXY',
    color: 'grey',
  },
  NPM: {
    text: 'NPM',
    color: 'purple',
  },
  COCOA_POD: {
    text: 'COCOA_POD',
    color: 'cyan',
  },
  DISTRIBUTION_ARCHIVE: {
    text: 'DISTRIBUTION_ARCHIVE',
    color: 'blue',
  },
};

interface IArtifactRepositoryTypeLabelProps {
  repositoryType: TargetRepository['repositoryType'];
}

export const ArtifactRepositoryTypeLabel = ({ repositoryType }: IArtifactRepositoryTypeLabelProps) => {
  const artifactRepositoryType = ARTIFACT_REPOSITORY_TYPES[repositoryType];

  return artifactRepositoryType ? (
    <Label color={artifactRepositoryType.color}>{artifactRepositoryType.text}</Label>
  ) : (
    <EmptyStateSymbol />
  );
};
