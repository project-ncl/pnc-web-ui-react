import { Artifact } from 'pnc-api-types-ts';

import { artifactQualityColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IArtifactQualityLabelMapperProps {
  quality: Artifact['artifactQuality'];
}

export const ArtifactQualityLabelMapper = ({ quality }: IArtifactQualityLabelMapperProps) => {
  const config = artifactQualityColorMap[quality] ?? { text: quality };
  return <LabelMapper mapperItem={config} />;
};
