import { TargetRepository } from 'pnc-api-types-ts';

import { ILabelMapper } from 'components/Label/Label';
import { Label } from 'components/Label/Label';

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
    color: 'red',
  },
};

interface IArtifactRepositoryTypeLabelProps {
  repositoryType: TargetRepository['repositoryType'];
}

export const ArtifactRepositoryTypeLabel = ({ repositoryType }: IArtifactRepositoryTypeLabelProps) => {
  return <Label labelObject={ARTIFACT_REPOSITORY_TYPES[repositoryType]}></Label>;
};
