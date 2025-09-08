import { useCallback, useMemo } from 'react';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { deliveredArtifactsSourceDescriptions } from 'common/deliveredArtifactsSourceDescriptions';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { FilteringPreset, TFilterPreset } from 'components/FilteringPreset/FilteringPreset';

import * as productMilestoneApi from 'services/productMilestoneApi';

import styles from './ProductMilestoneDeliveredArtifactListFilteringPresets.module.css';

interface IProductMilestoneDeliveredArtifactListFilteringPresetsProps {
  componentId: string;
  productMilestoneId: string;

  productId: string;
}

export const ProductMilestoneDeliveredArtifactListFilteringPresets = (
  props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps
) => {
  return (
    <div className={styles['filtering-presets']}>
      <BuiltInThisMilestoneFilteringPreset {...props} />

      <BuiltInOtherMilestonesFilteringPreset {...props} />

      <BuiltInOtherProductsFilteringPreset {...props} />

      <BuiltOutsideMilestoneFilteringPreset {...props} />

      <NotBuiltFilteringPreset {...props} />

      <NotBuiltFoundFilteringPreset {...props} />

      <NotBuiltNotFoundFilteringPreset {...props} />
    </div>
  );
};

const BuiltInThisMilestoneFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  const builtInThisMilestoneFilterPreset = useMemo(
    () => [
      {
        id: artifactEntityAttributes['build.productMilestone.id'].id,
        operator: '==' as const,
        values: [props.productMilestoneId],
      },
    ],
    [props.productMilestoneId]
  );

  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Built in this Milestone"
      description={`Filter ${deliveredArtifactsSourceDescriptions.thisMilestone.description}`}
      filterPreset={builtInThisMilestoneFilterPreset}
      {...props}
    />
  );
};

const BuiltInOtherMilestonesFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  const builtInOtherMilestonesFilterPreset = useMemo(
    () => [
      {
        id: artifactEntityAttributes['build.productMilestone.id'].id,
        operator: '==' as const,
        values: [`!${props.productMilestoneId}`],
      },
      {
        id: artifactEntityAttributes['build.productMilestone.productVersion.product.id'].id,
        operator: '==' as const,
        values: [props.productId],
      },
    ],
    [props.productMilestoneId, props.productId]
  );

  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Built in other Milestones"
      description={`Filter ${deliveredArtifactsSourceDescriptions.otherMilestones.description}`}
      filterPreset={builtInOtherMilestonesFilterPreset}
      {...props}
    />
  );
};

const BuiltInOtherProductsFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  const builtInOtherProductsFilterPreset = useMemo(
    () => [
      {
        id: artifactEntityAttributes['build.productMilestone.productVersion.product.id'].id,
        operator: '==' as const,
        values: [`!${props.productId}`],
      },
    ],
    [props.productId]
  );

  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Built in other Products"
      description={`Filter ${deliveredArtifactsSourceDescriptions.otherProducts.description}`}
      filterPreset={builtInOtherProductsFilterPreset}
      {...props}
    />
  );
};

const builtOutsideMilestoneFilterPreset = [
  {
    id: artifactEntityAttributes['build.productMilestone'].id,
    operator: '==' as const,
    values: ['null'],
  },
];

const BuiltOutsideMilestoneFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Built outside any Milestone"
      description={`Filter ${deliveredArtifactsSourceDescriptions.noMilestone.description}`}
      filterPreset={builtOutsideMilestoneFilterPreset}
      {...props}
    />
  );
};

const notBuiltFilterPreset = [{ id: artifactEntityAttributes.artifactQuality.id, operator: '==' as const, values: ['IMPORTED'] }];

const NotBuiltFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Not built"
      description={`Filter ${deliveredArtifactsSourceDescriptions.noBuild.description}`}
      filterPreset={notBuiltFilterPreset}
      isWarningOnGreaterThanZero
      {...props}
    />
  );
};

const notBuiltFoundFilterPreset = [
  ...notBuiltFilterPreset,
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['NPM', 'MAVEN', 'GENERIC_PROXY'],
  },
];

const NotBuiltFoundFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Not built, found"
      description="Filter Delivered Artifacts which were found in the registry, but not produced in any Build."
      filterPreset={notBuiltFoundFilterPreset}
      isWarningOnGreaterThanZero
      {...props}
    />
  );
};

const notBuiltNotFoundFilterPreset = [
  ...notBuiltFilterPreset,
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['DISTRIBUTION_ARCHIVE'],
  },
];

const NotBuiltNotFoundFilteringPreset = (props: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  return (
    <ProductMilestoneDeliveredArtifactListFilteringPreset
      title="Not built, not found"
      description="Filter Delivered Artifacts which were not found in the registry, their source in unknown."
      filterPreset={notBuiltNotFoundFilterPreset}
      isWarningOnGreaterThanZero
      {...props}
    />
  );
};

interface IProductMilestoneDeliveredArtifactListFilteringPresetProps
  extends IProductMilestoneDeliveredArtifactListFilteringPresetsProps {
  filterPreset: TFilterPreset;
  title: string;
  description: string;
  isWarningOnGreaterThanZero?: boolean;
}

const ProductMilestoneDeliveredArtifactListFilteringPreset = ({
  componentId,
  productMilestoneId,
  filterPreset,
  title,
  description,
  isWarningOnGreaterThanZero = false,
}: IProductMilestoneDeliveredArtifactListFilteringPresetProps) => {
  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const isWarning =
    isWarningOnGreaterThanZero && !!serviceContainerArtifacts.data?.totalHits && serviceContainerArtifacts.data.totalHits > 0;

  return (
    <FilteringPreset
      componentId={componentId}
      title={title}
      description={`${description}${isWarningOnGreaterThanZero ? ' Non-zero value may indicate a problem.' : ''}${
        isWarning ? ` There are ${serviceContainerArtifacts.data?.totalHits} existing artifacts to be reviewed.` : ''
      }`}
      filterPreset={filterPreset}
      serviceContainerEntitiesCount={serviceContainerArtifacts}
      serviceContainerEntitiesCountRunner={useCallback(
        (qParam) =>
          serviceContainerArtifactsRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: { pageSize: 0, q: qParam } },
          }),
        [serviceContainerArtifactsRunner, productMilestoneId]
      )}
      isWarning={isWarning}
    />
  );
};
