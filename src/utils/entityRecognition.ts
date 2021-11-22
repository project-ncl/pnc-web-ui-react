export const isBuild = (possibleBuild: any) => 'buildConfigRevision' in possibleBuild;

export const isGroupBuild = (possibleGroupBuild: any) => 'groupConfig' in possibleGroupBuild;
