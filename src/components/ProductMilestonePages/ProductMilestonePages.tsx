import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { PageTitles, SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductMilestonePagesProps {}

type ContextType = { serviceContainerMilestone: IServiceContainer };

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePagesProps>) => {
  const { productMilestoneId } = useParams();

  const serviceContainerMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerMilestoneRunner = serviceContainerMilestone.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getProductMilestoneDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerMilestoneRunner({ serviceData: { id: productMilestoneId } });

    serviceContainerArtifactsRunner({ serviceData: { id: productMilestoneId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [serviceContainerMilestoneRunner, serviceContainerArtifactsRunner, productMilestoneId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerMilestone,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: `${serviceContainerMilestone.data?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  const pageTabs = (
    <Tabs basePath="/products/:id/versions/:id/milestones/:id">
      <TabsItem relativePath="details">Details</TabsItem>
      <TabsItem relativePath="builds-performed">Builds Performed</TabsItem>
      <TabsItem relativePath="close-results">Close Results</TabsItem>
      <TabsItem relativePath="deliverables-analysis">Deliverables Analysis</TabsItem>
      <TabsItem relativePath="delivered-artifacts">
        Delivered Artifacts{' '}
        <Tooltip content="Total Count">
          <Label>
            <ServiceContainerLoading {...serviceContainerArtifacts} title="Delivered Artifacts Count" isInline>
              {serviceContainerArtifacts.data?.totalHits}
            </ServiceContainerLoading>
          </Label>
        </Tooltip>
      </TabsItem>
    </Tabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerMilestone} title="Product Milestone details">
      <PageLayout title={`Product Milestone ${serviceContainerMilestone.data?.version}`} tabs={pageTabs}>
        <Outlet context={{ serviceContainerMilestone }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerMilestone() {
  return useOutletContext<ContextType>();
}
