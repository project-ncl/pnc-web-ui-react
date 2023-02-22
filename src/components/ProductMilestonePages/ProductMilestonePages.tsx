import { Label, Tooltip } from '@patternfly/react-core';
import { AxiosRequestConfig } from 'axios';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TabItem } from 'components/Tabs/TabItem';
import { Tabs } from 'components/Tabs/Tabs';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestonePages {}

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePages>) => {
  const { milestoneId } = useParams();

  const serviceContainerMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerMilestoneRunner = serviceContainerMilestone.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getProductMilestoneDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerMilestoneRunner({ serviceData: { id: milestoneId } });

    const requestConfig: AxiosRequestConfig = { params: { pageSize: 2 } };
    serviceContainerArtifactsRunner({ serviceData: { id: milestoneId }, requestConfig });
  }, [serviceContainerMilestoneRunner, serviceContainerArtifactsRunner, milestoneId]);

  useTitle(
    serviceContainerMilestone.data?.version
      ? `${serviceContainerMilestone.data.version} | <unknown> | ${PageTitles.products}`
      : `Error loading ${PageTitles.productMilestones}`
  );

  const pageTabs = (
    <Tabs>
      <TabItem url={`/products-milestones/${milestoneId}/details/`}>Details</TabItem>
      <TabItem url={`/products-milestones/${milestoneId}/builds-performed/`}>Buils Performed</TabItem>
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
