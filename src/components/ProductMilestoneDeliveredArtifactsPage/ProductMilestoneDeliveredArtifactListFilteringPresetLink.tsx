import { PropsWithChildren, useMemo } from 'react';

import { FilteringPresetLink } from 'components/FilteringPreset/FilteringPresetLink';
import {
  builtOutsideMilestoneFilterPreset,
  getBuiltInOtherMilestonesFilterPreset,
  getBuiltInOtherProductsFilterPreset,
  getBuiltInThisMilestoneFilterPreset,
  notBuiltFilterPreset,
} from 'components/ProductMilestoneDeliveredArtifactsPage/common';

interface IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps extends PropsWithChildren {
  componentId: string;
  basePath: string;
}

export const BuiltInThisMilestoneFilteringPresetLink = ({
  componentId,
  basePath,
  productMilestoneId,
  children,
}: IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps & { productMilestoneId: string }) => {
  const builtInThisMilestoneFilterPreset = useMemo(
    () => getBuiltInThisMilestoneFilterPreset(productMilestoneId),
    [productMilestoneId]
  );

  return (
    <FilteringPresetLink filterPreset={builtInThisMilestoneFilterPreset} componentId={componentId} basePath={basePath}>
      {children}
    </FilteringPresetLink>
  );
};

export const BuiltInOtherMilestonesFilteringPresetLink = ({
  componentId,
  basePath,
  productMilestoneId,
  productId,
  children,
}: IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps & { productMilestoneId: string; productId: string }) => {
  const builtInOtherMilestonesFilterPreset = useMemo(
    () => getBuiltInOtherMilestonesFilterPreset(productMilestoneId, productId),
    [productMilestoneId, productId]
  );

  return (
    <FilteringPresetLink filterPreset={builtInOtherMilestonesFilterPreset} componentId={componentId} basePath={basePath}>
      {children}
    </FilteringPresetLink>
  );
};

export const BuiltInOtherProductsFilteringPresetLink = ({
  componentId,
  basePath,
  productId,
  children,
}: IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps & { productId: string }) => {
  const builtInOtherProductsFilterPreset = useMemo(() => getBuiltInOtherProductsFilterPreset(productId), [productId]);

  return (
    <FilteringPresetLink filterPreset={builtInOtherProductsFilterPreset} componentId={componentId} basePath={basePath}>
      {children}
    </FilteringPresetLink>
  );
};

export const BuiltOutsideMilestoneFilteringPresetLink = ({
  componentId,
  basePath,
  children,
}: IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps) => {
  return (
    <FilteringPresetLink filterPreset={builtOutsideMilestoneFilterPreset} componentId={componentId} basePath={basePath}>
      {children}
    </FilteringPresetLink>
  );
};

export const NotBuiltFilteringPresetLink = ({
  componentId,
  basePath,
  children,
}: IProductMilestoneDeliveredArtifactListFilteringPresetLinkProps) => {
  return (
    <FilteringPresetLink filterPreset={notBuiltFilterPreset} componentId={componentId} basePath={basePath}>
      {children}
    </FilteringPresetLink>
  );
};
