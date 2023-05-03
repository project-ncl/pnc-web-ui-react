import { TargetRepository } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const ARTIFACT_REPOSITORY_TYPES: ILabelMapper<TargetRepository['repositoryType']> = {
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

export const ArtifactRepositoryTypeLabelMapper = ({ repositoryType }: IArtifactRepositoryTypeLabelProps) => (
  <LabelMapper mapper={ARTIFACT_REPOSITORY_TYPES[repositoryType]} />
);
