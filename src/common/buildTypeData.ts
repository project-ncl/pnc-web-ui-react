import { BuildConfiguration } from 'pnc-api-types-ts';

export type TBuildType = NonNullable<BuildConfiguration['buildType']>;

type TBuildTypeData = {
  [buildType in TBuildType]: {
    id: buildType;
    title: string;
  };
};

export const buildTypeData: TBuildTypeData = {
  MVN: {
    id: 'MVN',
    title: 'Maven',
  },
  NPM: {
    id: 'NPM',
    title: 'Node Package Manager (NPM)',
  },
  GRADLE: {
    id: 'GRADLE',
    title: 'Gradle',
  },
  SBT: {
    id: 'SBT',
    title: 'Scala Build Tool (SBT)',
  },
} as const;
