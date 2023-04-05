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
          <CardFlexItem description="Number of Artifacts produced by Builds contained in this Milestone.">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts built in this Milestone">
                {serviceContainerStatistics.data?.artifactsSource.thisMilestone}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts built in this Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Number of Delivered Artifacts produced by Builds contained in this Milestone.">
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Delivered Artifacts built in this Milestone"
              >
                {serviceContainerStatistics.data?.deliveredArtifactsSource.thisMilestone}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Delivered Artifacts built in this Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Number of Delivered Artifacts produced by Builds contained in previous Milestones of the same Product.">
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Delivered Artifacts built in other Milestones"
              >
                {serviceContainerStatistics.data?.deliveredArtifactsSource.previousMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Delivered Artifacts built in other Milestones</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Number of Delivered Artifacts produced by Builds contained in Milestones of other Products.">
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Delivered Artifacts built in other Products"
              >
                {serviceContainerStatistics.data?.deliveredArtifactsSource.otherProducts}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Delivered Artifacts built in other Products</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Number of Delived Artifacts produced by Builds not contained in any Milestone. This may include Artifacts from Brew.">
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Delivered Artifacts built outside any Milestone"
              >
                {serviceContainerStatistics.data?.deliveredArtifactsSource.noMilestone}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Delivered Artifacts built outside any Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem description="Number of Delivered Artifacts not produced in any Build. Non-zero value may indicate a problem.">
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Not built Delivered Artifacts">
                {serviceContainerStatistics.data?.deliveredArtifactsSource.noBuild}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Not built Delivered Artifacts</CardTitle>
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
              description="Chart displays proportion of quality of Delivered Artifacts."
              legendHeight={100}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Repository Type Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} hasSkeleton title="Repository Type Distribution">
            <DoughnutChart
              data={serviceContainerStatistics.data?.repositoryType}
              description={
                <div>
                  Chart displays proportion of repository type of Delivered Artifacts.
                  <dl className="m-t-20">
                    <dt>
                      <b>MAVEN</b>
                    </dt>
                    <dd>Build automation tool used primarily for Java projects.</dd>
                  </dl>
                  <dl className="m-t-20">
                    <dt>
                      <b>NPM</b>
                    </dt>
                    <dd>Package manager for JavaScript language.</dd>
                  </dl>
                  <dl className="m-t-20">
                    <dt>
                      <b>COCOA_POD</b>
                    </dt>
                    <dd>Dependency manager for Swift and Objective-C languages.</dd>
                  </dl>
                  <dl className="m-t-20">
                    <dt>
                      <b>GENERIC_PROXY</b>
                    </dt>
                    <dd>Downloaded from Internet URL address.</dd>
                  </dl>
                  <dl className="m-t-20">
                    <dt>
                      <b>DISTRIBUTION_ARCHIVE</b>
                    </dt>
                    <dd>Found in analyzed Deliverables Archive.</dd>
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
