import { BuildConfiguration } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const BUILD_CONFIG_BUILD_TYPES: ILabelMapper<BuildConfiguration['buildType']> = {
  MVN: {
    text: 'MVN',
    color: 'gold',
  },
  NPM: {
    text: 'NPM',
    color: 'purple',
  },
  GRADLE: {
    text: 'GRADLE',
    color: 'cyan',
  },
  SBT: {
    text: 'SBT',
    color: 'grey',
  },
};

interface IBuildConfigBuildTypeLabelMapperProps {
  buildType: BuildConfiguration['buildType'];
}

export const BuildConfigBuildTypeLabelMapper = ({ buildType }: IBuildConfigBuildTypeLabelMapperProps) => (
  <LabelMapper mapperItem={BUILD_CONFIG_BUILD_TYPES[buildType]} />
);
