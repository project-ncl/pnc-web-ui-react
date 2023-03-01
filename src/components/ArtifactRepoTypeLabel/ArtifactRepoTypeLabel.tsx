import { Label, LabelProps } from '@patternfly/react-core';

import { TargetRepository } from 'pnc-api-types-ts';

interface QualityMapper {
  [key: string]: {
    text: string;
    color: LabelProps['color'];
  };
}

const ARTIFACT_REPO_TYPES: QualityMapper = {
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

interface IArtifactRepoTypeLabelProps {
  repoType: TargetRepository['repositoryType'];
}

export const ArtifactRepoTypeLabel = ({ repoType }: IArtifactRepoTypeLabelProps) => {
  const artifactRepoType = ARTIFACT_REPO_TYPES[repoType];

  return artifactRepoType ? <Label color={artifactRepoType.color}>{artifactRepoType.text}</Label> : <>&mdash;</>;
};
