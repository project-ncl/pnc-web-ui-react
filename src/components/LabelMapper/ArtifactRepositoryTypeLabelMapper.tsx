import { TargetRepository } from 'pnc-api-types-ts';

import { repositoryTypeColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IArtifactRepositoryTypeLabelMapperProps {
  repositoryType: TargetRepository['repositoryType'];
}

export const ArtifactRepositoryTypeLabelMapper = ({ repositoryType }: IArtifactRepositoryTypeLabelMapperProps) => {
  const config = repositoryTypeColorMap[repositoryType] ?? {
    text: repositoryType,
  };
  return <LabelMapper mapperItem={config} />;
};
