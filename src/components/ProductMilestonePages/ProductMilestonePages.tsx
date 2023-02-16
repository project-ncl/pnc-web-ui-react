import { Label, PageSection, PageSectionVariants, Text, TextContent, Tooltip } from '@patternfly/react-core';
import { AxiosRequestConfig } from 'axios';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TabItem } from 'components/Tabs/TabItem';
import { Tabs } from 'components/Tabs/Tabs';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestonePages {}

export const ProductMilestonePages = ({ children }: PropsWithChildren<IProductMilestonePages>) => {
  const { milestoneId } = useParams();

  const [deliveredArtifactsCount, setDeliveredArtifactsCount] = useState<number>();

  const serviceContainerMilestone = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerMilestoneRunner = serviceContainerMilestone.run;

  const serviceContainerArtifacts = useServiceContainer(productMilestoneApi.getProductMilestoneDeliveredArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useEffect(() => {
    serviceContainerMilestoneRunner({ serviceData: { id: milestoneId } });

    const requestConfig: AxiosRequestConfig = { params: { pageSize: 1 } };
    serviceContainerArtifactsRunner({ serviceData: { id: milestoneId }, requestConfig }).then((data: any) => {
      setDeliveredArtifactsCount(data.data.totalHits);
    });
  }, [serviceContainerMilestoneRunner, serviceContainerArtifactsRunner, milestoneId]);

  useTitle(
    serviceContainerMilestone.data?.version
      ? `${serviceContainerMilestone.data.version} | <unknown> | ${PageTitles.products}`
      : `Error loading ${PageTitles.productMilestones}`
  );

  return (
    <ServiceContainerLoading {...serviceContainerMilestone} title="Product Milestone details">
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Product Milestone {serviceContainerMilestone.data?.version}</Text>
        </TextContent>
      </PageSection>

      <Tabs>
        <TabItem url={`/products-milestones/${milestoneId}/details/`}>
          <Text>Details</Text>
        </TabItem>
        <TabItem url={`/products-milestones/${milestoneId}/builds-performed/`}>
          <Text>Buils Performed</Text>
        </TabItem>
        <TabItem url={`/products-milestones/${milestoneId}/close-results/`}>
          <Text>Close Results</Text>
        </TabItem>
        <TabItem url={`/products-milestones/${milestoneId}/deliverables-analysis/`}>
          <Text>Deliverables Analysis</Text>
        </TabItem>
        <TabItem url={`/products-milestones/${milestoneId}/delivered-artifacts/`}>
          <Text>
            Delivered Artifacts{' '}
            <Tooltip content={<div>Total Count</div>}>
              <Label>{deliveredArtifactsCount}</Label>
            </Tooltip>
          </Text>
        </TabItem>
      </Tabs>

      {children}
    </ServiceContainerLoading>
  );
};
