import { buildTypeData } from 'common/buildTypeData';
import { buildTypeColorMap } from 'common/colorMap';
import { BuildConfiguration } from 'common/pnc-api-types-ts';

import { BuildTypeMvnRpmExperimentalTooltip } from 'components/BuildTypeMvnRpmExperimental/BuildTypeMvnRpmExperimental';
import { LabelMapper } from 'components/LabelMapper/LabelMapper';

interface IBuildConfigBuildTypeLabelMapperProps {
  buildType: BuildConfiguration['buildType'];
  displayTooltip?: boolean;
}

export const BuildConfigBuildTypeLabelMapper = ({ buildType, displayTooltip = false }: IBuildConfigBuildTypeLabelMapperProps) => {
  const config = buildTypeColorMap[buildType] ?? { text: buildType };
  return (
    <>
      <LabelMapper mapperItem={config} tooltip={displayTooltip ? 'Build Type' : undefined} />
      {buildType === buildTypeData.MVN_RPM.id ? <BuildTypeMvnRpmExperimentalTooltip /> : undefined}
    </>
  );
};
