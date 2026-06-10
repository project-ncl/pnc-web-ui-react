import { artifactQualityColorMap } from 'common/colorMap';
import { Artifact } from 'common/pnc-api-types-ts';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IArtifactQualityLabelMapperProps {
  quality: Artifact['artifactQuality'];
}

export const ArtifactQualityLabelMapper = ({ quality }: IArtifactQualityLabelMapperProps) => {
  const config = artifactQualityColorMap[quality] ?? { text: quality };
  return <LabelMapper mapperItem={config} />;
};
