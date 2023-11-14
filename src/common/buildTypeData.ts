import { BuildConfiguration } from 'pnc-api-types-ts';

export type BuildType = NonNullable<BuildConfiguration['buildType']>;

type TBuildTypeData = {
  [buildType in BuildType]: {
    title: string;
  };
};

export const buildTypeData: TBuildTypeData = {
  MVN: {
    title: 'Maven',
  },
  NPM: {
    title: 'Node Package Manager (NPM)',
  },
  GRADLE: {
    title: 'Gradle',
  },
  SBT: {
    title: 'Scala Build Tool (SBT)',
  },
} as const;
