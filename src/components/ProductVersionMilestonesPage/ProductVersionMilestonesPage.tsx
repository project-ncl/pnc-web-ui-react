import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ProductVersionMilestonesList } from 'components/ProductVersionMilestonesList/ProductVersionMilestonesList';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionMilestonesPageProps {
  componentId?: string;
}

export const ProductVersionMilestonesPage = ({ componentId = 'm1' }: IProductVersionMilestonesPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerProductMilestones = useServiceContainer(productVersionApi.getProductMilestones);
  const serviceContainerProductMilestonesRunner = serviceContainerProductMilestones.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductMilestonesRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Product Milestones</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ActionButton link="create">Create Milestone</ActionButton>
        </ToolbarItem>
      </Toolbar>

      <ProductVersionMilestonesList {...{ serviceContainerProductMilestones, componentId }} />
    </>
  );
};
