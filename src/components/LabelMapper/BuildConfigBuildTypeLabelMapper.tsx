import { BuildConfiguration } from 'pnc-api-types-ts';

import { buildTypeData } from 'common/buildTypeData';
import { buildTypeColorMap } from 'common/colorMap';

import { BuildTypeMvnRpmExperimentalTooltip } from 'components/BuildTypeMvnRpmExperimental/BuildTypeMvnRpmExperimental';
import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IBuildConfigBuildTypeLabelMapperProps {
  buildType: BuildConfiguration['buildType'];
}

export const BuildConfigBuildTypeLabelMapper = ({ buildType }: IBuildConfigBuildTypeLabelMapperProps) => {
  const config = buildTypeColorMap[buildType] ?? { text: buildType };
  return (
    <>
      <LabelMapper mapperItem={config} />
      {buildType === buildTypeData.MVN_RPM.id ? <BuildTypeMvnRpmExperimentalTooltip /> : undefined}
    </>
  );
};
