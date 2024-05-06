import { Label, Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ProductVersionMilestonesList } from 'components/ProductVersionMilestonesList/ProductVersionMilestonesList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
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
          <ProtectedComponent>
            <ActionButton link="create">Create Milestone</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
        <Text>
          Product Milestone represents the working release suffix of the parent Product Version like <Label>0.CR1</Label>, for
          example Product Version of <Label>1.0.0.CR1</Label>. Each Product Version can contain multiple Product Milestones. Only
          one Product Milestone can be set as active.
        </Text>
      </Toolbar>

      <ProductVersionMilestonesList {...{ serviceContainerProductMilestones, componentId }} />
    </>
  );
};
