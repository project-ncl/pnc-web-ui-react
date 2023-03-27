import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ProductMilestoneAttributes } from 'common/ProductMilestoneAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { CardDescription } from 'components/CardFlex/CardDescription';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem } from 'components/CardFlex/CardFlexItem';
import { CardValue } from 'components/CardFlex/CardValue';
import { DoughnutChart } from 'components/Charts/DoughnutChart';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProductMilestoneCloseStatusLabel } from 'components/ProductMilestoneCloseStatusLabel/ProductMilestoneCloseStatusLabel';
import { useServiceContainerMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { createDateTime } from 'utils/utils';

export const ProductMilestoneDetailPage = () => {
  const { productMilestoneId } = useParams();

  const { serviceContainerMilestone } = useServiceContainerMilestone();

  const serviceContainerCloseResults = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerCloseResultsRunner = serviceContainerCloseResults.run;

  const serviceContainerStatistics = useServiceContainer(productMilestoneApi.getStatistics);
  const serviceContainerStatisticsRunner = serviceContainerStatistics.run;

  useEffect(() => {
    serviceContainerCloseResultsRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: { params: { latest: true } },
    });
    serviceContainerStatisticsRunner({
      serviceData: { id: productMilestoneId },
    });
  }, [serviceContainerCloseResultsRunner, serviceContainerStatisticsRunner, productMilestoneId]);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding>
          <Attributes>
            <AttributesItem title={ProductMilestoneAttributes.status.title}>
              {serviceContainerMilestone.data?.endDate ? 'CLOSED' : 'OPEN'}
            </AttributesItem>
            <AttributesItem title={ProductMilestoneAttributes.startingDate.title}>
              {createDateTime({ date: serviceContainerMilestone.data.startingDate, includeTime: false })}
            </AttributesItem>
            <AttributesItem title={ProductMilestoneAttributes.plannedEndDate.title}>
              {createDateTime({ date: serviceContainerMilestone.data.plannedEndDate, includeTime: false })}
            </AttributesItem>
            <AttributesItem title={ProductMilestoneAttributes.endDate.title}>
              {createDateTime({ date: serviceContainerMilestone.data.endDate, includeTime: false })}
            </AttributesItem>
            <AttributesItem title={ProductMilestoneAttributes.lastCloseResut.title}>
              <div style={{ height: '25px' }}>
                <ServiceContainerLoading
                  {...serviceContainerCloseResults}
                  variant="inline"
                  title="Product Milestone latest close result"
                >
                  <ProductMilestoneCloseStatusLabel status={serviceContainerCloseResults.data?.content[0]?.status} />
                </ServiceContainerLoading>
              </div>
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <CardFlex>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifact built in this Milestone">
                {serviceContainerStatistics.data?.artifactSource.thisMilestone}
              </ServiceContainerLoading>
            </CardValue>
            <CardDescription>Artifact built in this Milestone</CardDescription>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts built in other Milestones">
                {serviceContainerStatistics.data?.artifactSource.otherMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardDescription>Artifacts built in other Milestones</CardDescription>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts not built in a Milestone">
                {serviceContainerStatistics.data?.artifactSource.notBuilt}
              </ServiceContainerLoading>
            </CardValue>
            <CardDescription>Artifacts not built in a Milestone</CardDescription>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Previous Milestones">
                {serviceContainerStatistics.data?.previousMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardDescription>Previous Milestones</CardDescription>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts from previous Milestones">
                {serviceContainerStatistics.data?.artifactSource.previousMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardDescription>Artifacts from previous Milestones</CardDescription>
          </CardFlexItem>
        </CardFlex>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Artifact Quality Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} hasSkeleton title="Artifact Quality Distribution">
            <DoughnutChart
              data={serviceContainerStatistics.data?.artifactQuality}
              description={{
                textTop: 'Chart displays proportion of quality of delivered artifacts.',
                attributes: [
                  // TODO
                  {
                    label: 'BUILT',
                    value: 'Built artifact...',
                  },
                ],
              }}
              legendHeight={100}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Repository Chart Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} hasSkeleton title="Repository Type Distribution">
            <DoughnutChart
              data={serviceContainerStatistics.data?.repositoryType}
              description={{
                textTop: 'Chart displays proportion of repository type of delivered artifacts.',
                attributes: [
                  // TODO
                  {
                    label: 'MAVEN',
                    value: 'Artifact from MAVEN...',
                  },
                ],
              }}
              legendHeight={100}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
