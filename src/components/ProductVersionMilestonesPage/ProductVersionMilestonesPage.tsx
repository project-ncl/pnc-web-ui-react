import { Label, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { ProductMilestoneRef } from 'pnc-api-types-ts';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ProductVersionMilestonesList } from 'components/ProductVersionMilestonesList/ProductVersionMilestonesList';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionMilestonesPageProps {
  componentId?: string;
}

export const ProductVersionMilestonesPage = ({ componentId = 'm1' }: IProductVersionMilestonesPageProps) => {
  const { productVersionId } = useParamsRequired();

  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  const serviceContainerProductMilestones = useServiceContainer(productVersionApi.getProductMilestones);
  const serviceContainerProductMilestonesRunner = serviceContainerProductMilestones.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerProductMilestonesRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerProductMilestonesRunner, productVersionId]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.pagination }
  );

  const latestProductMilestone: ProductMilestoneRef | undefined =
    serviceContainerProductVersion.data?.productMilestones &&
    Object.values(serviceContainerProductVersion.data.productMilestones).at(-1);

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component={TextVariants.h2}>Product Milestones</Text>
            <Text>
              Product Milestone represents the working release suffix of the parent Product Version like <Label>0.CR1</Label>, for
              example Product Version of <Label>1.0.0.CR1</Label>. Each Product Version can contain multiple Product Milestones.
              Only one Product Milestone can be set as current.
            </Text>
          </TextContent>
          {latestProductMilestone && (
            <TextContent>
              <br />
              <Text>
                <>
                  {serviceContainerProductVersion.data?.currentProductMilestone?.id ? (
                    <>
                      The <b>current</b> Product Milestone is{' '}
                      <ProductMilestoneReleaseLabel
                        link={`../milestones/${serviceContainerProductVersion.data.currentProductMilestone.id}`}
                        productMilestoneRelease={serviceContainerProductVersion.data.currentProductMilestone}
                        isCurrent={true}
                      />
                    </>
                  ) : (
                    <>
                      No Product Milestone is set as <b>current</b>
                    </>
                  )}{' '}
                  and the <b>latest</b> is{' '}
                  <ProductMilestoneReleaseLabel
                    link={`../milestones/${latestProductMilestone.id}`}
                    productMilestoneRelease={latestProductMilestone}
                    isCurrent={latestProductMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id}
                  />
                </>
              </Text>
            </TextContent>
          )}
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton link="create">Create Milestone</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ProductVersionMilestonesList {...{ serviceContainerProductMilestones, componentId }} />
    </>
  );
};
