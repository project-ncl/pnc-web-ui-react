import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProductVersionMilestonesList } from 'components/ProductVersionMilestonesList/ProductVersionMilestonesList';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionMilestonesPageProps {
  componentId?: string;
}

export const ProductVersionMilestonesPage = ({ componentId = 'm1' }: IProductVersionMilestonesPageProps) => {
  const { productVersionId } = useParams();

  const serviceContainerProductMilestones = useServiceContainer(productVersionApi.getProductMilestones);
  const serviceContainerProductMilestonesRunner = serviceContainerProductMilestones.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductMilestonesRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Product Milestones</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ActionButton link="create">Create Milestone</ActionButton>
        </ToolbarItem>
      </Toolbar>
      <ContentBox borderTop>
        <ProductVersionMilestonesList {...{ serviceContainerProductMilestones, componentId }} />
      </ContentBox>
    </>
  );
};
