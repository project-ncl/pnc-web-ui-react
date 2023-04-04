import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ProductMilestoneAttributes } from 'common/ProductMilestoneAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem } from 'components/CardFlex/CardFlexItem';
import { CardTitle } from 'components/CardFlex/CardTitle';
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
            <CardTitle>Artifact built in this Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts built in other Milestones">
                {serviceContainerStatistics.data?.artifactSource.otherMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts built in other Milestones</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts not built in a Milestone">
                {serviceContainerStatistics.data?.artifactSource.notBuilt}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts not built in a Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Previous Milestones">
                {serviceContainerStatistics.data?.previousMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Previous Milestones</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Description... TODO">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts from previous Milestones">
                {serviceContainerStatistics.data?.artifactSource.previousMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts from previous Milestones</CardTitle>
          </CardFlexItem>
        </CardFlex>
      </GridItem>

      <GridItem span={6}>
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
              description={
                <div>
                  Chart displays proportion of quality of delivered artifacts.
                  <dl className="m-t-20">
                    <dt>
                      <b>BUILT</b>
                    </dt>
                    <dd>Built artifact...</dd>
                  </dl>
                </div>
              }
              legendHeight={100}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem span={6}>
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
              description={
                <div>
                  Chart displays proportion of repository type of delivered artifacts.
                  <dl className="m-t-20">
                    <dt>
                      <b>MAVEN</b>
                    </dt>
                    <dd>Artifact from MAVEN...</dd>
                  </dl>
                </div>
              }
              legendHeight={100}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
