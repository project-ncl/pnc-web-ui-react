import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

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

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <PageSectionHeader
            title="Delivered Artifacts"
            description={
              <>This list contains Artifacts delivered in the Milestone. Each Artifact is represented by a PNC Identifier.</>
            }
          />
        </ToolbarItem>
      </Toolbar>
      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </>
  );
};
