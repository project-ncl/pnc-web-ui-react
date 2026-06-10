import { repositoryTypeColorMap } from 'common/colorMap';
import { TargetRepository } from 'common/pnc-api-types-ts';

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
