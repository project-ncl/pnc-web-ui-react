import { useCallback } from 'react';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { FilteringPreset } from 'components/FilteringPreset/FilteringPreset';

import * as productMilestoneApi from 'services/productMilestoneApi';

import styles from './ProductMilestoneDeliveredArtifactListFilteringPresets.module.css';

interface IProductMilestoneDeliveredArtifactListFilteringPresetsProps {
  componentId: string;
  productMilestoneId: string;
}

export const ProductMilestoneDeliveredArtifactListFilteringPresets = ({
  componentId,
  productMilestoneId,
}: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  return (
    <div className={styles['filtering-presets']}>
      <b className={styles['filtering-presets--title']}>Predefined filters:</b>

      <NotFoundNotBuiltFilteringPreset componentId={componentId} productMilestoneId={productMilestoneId} />

      <FoundNotBuiltFilteringPreset componentId={componentId} productMilestoneId={productMilestoneId} />
    </div>
  );
};

const notFoundNotBuiltFilterPreset = [
  { id: artifactEntityAttributes.artifactQuality.id, operator: '==' as const, values: ['IMPORTED'] },
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['DISTRIBUTION_ARCHIVE'],
  },
];

const NotFoundNotBuiltFilteringPreset = ({
  componentId,
  productMilestoneId,
}: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const isWarning = !!serviceContainerArtifacts.data?.totalHits && serviceContainerArtifacts.data.totalHits > 0;

  return (
    <FilteringPreset
      componentId={componentId}
      title="Not built, not found"
      description={`Filter artifacts which were NOT found in the registry, their source in unknown. Number higher than 0 might indicate a problem. ${
        isWarning ? `There are ${serviceContainerArtifacts.data?.totalHits} existing artifacts to be reviewed.` : ''
      } `}
      filterPreset={notFoundNotBuiltFilterPreset}
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

const foundNotBuiltFilterPreset = [
  { id: artifactEntityAttributes.artifactQuality.id, operator: '==' as const, values: ['IMPORTED'] },
  {
    id: artifactEntityAttributes['targetRepository.repositoryType'].id,
    operator: '==' as const,
    values: ['NPM', 'MAVEN', 'COCOA_POD'],
  },
];

const FoundNotBuiltFilteringPreset = ({
  componentId,
  productMilestoneId,
}: IProductMilestoneDeliveredArtifactListFilteringPresetsProps) => {
  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const isWarning = !!serviceContainerArtifacts.data?.totalHits && serviceContainerArtifacts.data.totalHits > 0;

  return (
    <FilteringPreset
      componentId={componentId}
      title="Not built, found"
      description={`Filter artifacts which were found in the registry, but not built in PNC. Number higher than 0 might indicate a problem. ${
        isWarning ? `There are ${serviceContainerArtifacts.data?.totalHits} existing artifacts to be reviewed.` : ''
      } `}
      filterPreset={foundNotBuiltFilterPreset}
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
