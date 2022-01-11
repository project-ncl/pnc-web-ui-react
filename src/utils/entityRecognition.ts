export const isBuild = (possibleBuild: any) => 'buildConfigRevision' in possibleBuild;

export const isGroupBuild = (possibleGroupBuild: any) => 'groupConfig' in possibleGroupBuild;

export const isProductMilestone = (possibleProductMilestone: any) => 'startingDate' in possibleProductMilestone;

export const isProductRelease = (possibleProductRelease: any) => 'supportLevel' in possibleProductRelease;
