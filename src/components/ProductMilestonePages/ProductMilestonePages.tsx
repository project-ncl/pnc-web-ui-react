import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { PageTitles, SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';
import { TabsLabel } from 'components/Tabs/TabsLabel';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductMilestonePagesProps {}

type ContextType = { serviceContainerProductMilestone: IServiceContainer };

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePagesProps>) => {
  const { productMilestoneId } = useParams();

  const serviceContainerProductMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerProductMilestoneRunner = serviceContainerProductMilestone.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerProductMilestoneRunner({ serviceData: { id: productMilestoneId } });

    serviceContainerArtifactsRunner({ serviceData: { id: productMilestoneId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [serviceContainerProductMilestoneRunner, serviceContainerArtifactsRunner, productMilestoneId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductMilestone,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: `${serviceContainerProductMilestone.data?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="builds-performed">Builds Performed</TabsItem>
      <TabsItem url="close-results">Close Results</TabsItem>
      <TabsItem url="deliverables-analysis">Deliverables Analysis</TabsItem>
      <TabsItem url="delivered-artifacts">
        Delivered Artifacts{' '}
        <TabsLabel serviceContainer={serviceContainerArtifacts} title={'Delivered Artifacts Count'}>
          {serviceContainerArtifacts.data?.totalHits}
        </TabsLabel>
      </TabsItem>
      <TabsItem url="interconnection-graph">Interconnection Graph</TabsItem>
    </Tabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductMilestone} title="Product Milestone details">
      <PageLayout title={`Product Milestone ${serviceContainerProductMilestone.data?.version}`} tabs={pageTabs}>
        <Outlet context={{ serviceContainerProductMilestone }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerProductMilestone() {
  return useOutletContext<ContextType>();
}
