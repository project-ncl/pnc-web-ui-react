import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles, SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TabItem } from 'components/Tabs/TabItem';
import { Tabs } from 'components/Tabs/Tabs';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestonePagesProps {}

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
    serviceContainerMilestone.data?.version
      ? `${serviceContainerMilestone.data.version} | <unknown> | ${PageTitles.products}`
      : `Error loading ${PageTitles.productMilestones}`
  );

  const pageTabs = (
    <Tabs>
      <TabItem url={`/products-milestones/${milestoneId}/details/`}>Details</TabItem>
      <TabItem url={`/products-milestones/${milestoneId}/builds-performed/`}>Builds Performed</TabItem>
      <TabItem url={`/products-milestones/${milestoneId}/close-results/`}>Close Results</TabItem>
      <TabItem url={`/products-milestones/${milestoneId}/deliverables-analysis/`}>Deliverables Analysis</TabItem>
      <TabItem url={`/products-milestones/${milestoneId}/delivered-artifacts/`}>
        Delivered Artifacts{' '}
        <Tooltip content={<div>Total Count</div>}>
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
        {children}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
