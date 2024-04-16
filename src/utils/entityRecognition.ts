import {
  Artifact,
  Build,
  BuildConfiguration,
  GroupBuild,
  GroupConfiguration,
  Product,
  ProductMilestone,
  ProductVersion,
} from 'pnc-api-types-ts';

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export const isString = (value: unknown): value is string => typeof value === 'string';

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const isBuild = (build: Build | GroupBuild): build is Build => 'buildConfigRevision' in build;

export const isGroupBuild = (build: Build | GroupBuild): build is GroupBuild => 'groupConfig' in build;

export const isBuildConfig = (config: BuildConfiguration | GroupConfiguration): config is BuildConfiguration =>
  'project' in config;

export const isGroupConfig = (config: BuildConfiguration | GroupConfiguration): config is GroupConfiguration =>
  'buildConfigs' in config;

export const isProductMilestone = (possibleProductMilestone: any) => 'startingDate' in possibleProductMilestone;

export const isProductRelease = (possibleProductRelease: any) => 'supportLevel' in possibleProductRelease;

interface ArtifactWithProductMilestone extends Artifact {
  product: Product;
  productVersion: ProductVersion;
  productMilestone: ProductMilestone;
}

export const isArtifactWithProductMilestone = (artifact: Artifact): artifact is ArtifactWithProductMilestone =>
  'product' in artifact && 'productVersion' in artifact && 'productMilestone' in artifact;
