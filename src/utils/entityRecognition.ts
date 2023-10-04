import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

export const isBuild = (possibleBuild: any) => 'buildConfigRevision' in possibleBuild;

export const isGroupBuild = (possibleGroupBuild: any) => 'groupConfig' in possibleGroupBuild;

export const isBuildConfig = (config: BuildConfiguration | GroupConfiguration): config is BuildConfiguration =>
  'project' in config;

export const isGroupConfig = (config: BuildConfiguration | GroupConfiguration): config is GroupConfiguration =>
  'buildConfigs' in config;

export const isProductMilestone = (possibleProductMilestone: any) => 'startingDate' in possibleProductMilestone;

export const isProductRelease = (possibleProductRelease: any) => 'supportLevel' in possibleProductRelease;
