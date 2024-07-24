import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneDeliveredArtifactsPageProps {
  componentId?: string;
}

export const ProductMilestoneDeliveredArtifactsPage = ({ componentId = 'd1' }: IProductMilestoneDeliveredArtifactsPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
      [serviceContainerArtifactsRunner, productMilestoneId]
    ),
    { componentId }
  );

  return <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />;
};
