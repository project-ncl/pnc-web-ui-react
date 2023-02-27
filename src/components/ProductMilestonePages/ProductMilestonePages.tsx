import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { PageTitles, SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TabItem } from 'components/Tabs/TabItem';
import { Tabs } from 'components/Tabs/Tabs';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductMilestonePagesProps {}

// TOTO: Change to appropriate type once implemented
type ContextType = { serviceContainerMilestone: any };

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePagesProps>) => {
  const { milestoneId } = useParams();

  const serviceContainerMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerMilestoneRunner = serviceContainerMilestone.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getProductMilestoneDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerMilestoneRunner({ serviceData: { id: milestoneId } });

    serviceContainerArtifactsRunner({ serviceData: { id: milestoneId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [serviceContainerMilestoneRunner, serviceContainerArtifactsRunner, milestoneId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerMilestone,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: `${serviceContainerMilestone.data?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  const pageTabs = (
    <Tabs>
      <TabItem url={`details`}>Details</TabItem>
      <TabItem url={`builds-performed`}>Builds Performed</TabItem>
      <TabItem url={`close-results`}>Close Results</TabItem>
      <TabItem url={`deliverables-analysis`}>Deliverables Analysis</TabItem>
      <TabItem url={`delivered-artifacts`}>
        Delivered Artifacts{' '}
        <Tooltip content="Total Count">
          <Label>
            <ServiceContainerLoading {...serviceContainerArtifacts} title="Delivered Artifacts Count" isInline>
              {serviceContainerArtifacts.data?.totalHits}
            </ServiceContainerLoading>
          </Label>
        </Tooltip>
      </TabItem>
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
