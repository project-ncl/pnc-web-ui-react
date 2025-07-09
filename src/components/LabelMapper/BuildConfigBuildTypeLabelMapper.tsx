import { BuildConfiguration } from 'pnc-api-types-ts';

import { buildTypeColorMap } from 'common/colorMap';

import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IBuildConfigBuildTypeLabelMapperProps {
  buildType: BuildConfiguration['buildType'];
}

export const BuildConfigBuildTypeLabelMapper = ({ buildType }: IBuildConfigBuildTypeLabelMapperProps) => {
  const config = buildTypeColorMap[buildType] ?? { text: buildType };
  return <LabelMapper mapperItem={config} />;
};
