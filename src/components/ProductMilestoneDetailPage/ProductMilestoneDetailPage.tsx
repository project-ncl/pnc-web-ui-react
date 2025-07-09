import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect, useMemo } from 'react';

import { artifactQualityColorMap, repositoryTypeColorMap } from 'common/colorMap';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem } from 'components/CardFlex/CardFlexItem';
import { CardTitle } from 'components/CardFlex/CardTitle';
import { CardValue } from 'components/CardFlex/CardValue';
import { DoughnutChart } from 'components/Charts/DoughnutChart';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { useServiceContainerProductMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { doughnutChartDataTransform, doughnutChartLabelTransform } from 'utils/dataTransformHelper';

export const ProductMilestoneDetailPage = () => {
  const { productMilestoneId } = useParamsRequired();

  const { serviceContainerProductMilestone } = useServiceContainerProductMilestone();

  const serviceContainerStatistics = useServiceContainer(productMilestoneApi.getStatistics);
  const serviceContainerStatisticsRunner = serviceContainerStatistics.run;

  const dougnutChartArtifactQuality = useMemo(
    () => ({
      data: doughnutChartDataTransform(serviceContainerStatistics.data?.artifactQuality),
      labels: doughnutChartLabelTransform(serviceContainerStatistics.data?.artifactQuality),
    }),
    [serviceContainerStatistics.data]
  );

  const dougnutChartRepositoryType = useMemo(
    () => ({
      data: doughnutChartDataTransform(serviceContainerStatistics.data?.repositoryType),
      labels: doughnutChartLabelTransform(serviceContainerStatistics.data?.repositoryType),
    }),
    [serviceContainerStatistics.data]
  );

  useEffect(() => {
    serviceContainerStatisticsRunner({
      serviceData: { id: productMilestoneId },
    });
  }, [serviceContainerStatisticsRunner, productMilestoneId]);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding isResponsive>
          <Attributes>
            <AttributesItem title={productMilestoneEntityAttributes.status.title}>
              {serviceContainerProductMilestone.data?.endDate ? 'CLOSED' : 'OPEN'}
            </AttributesItem>
            <AttributesItem title={productMilestoneEntityAttributes.startingDate.title}>
              {serviceContainerProductMilestone.data?.startingDate && (
                <DateTime date={serviceContainerProductMilestone.data.startingDate} displayTime={false} />
              )}
            </AttributesItem>
            <AttributesItem title={productMilestoneEntityAttributes.plannedEndDate.title}>
              {serviceContainerProductMilestone.data?.plannedEndDate && (
                <DateTime date={serviceContainerProductMilestone.data.plannedEndDate} displayTime={false} />
              )}
            </AttributesItem>
            <AttributesItem title={productMilestoneEntityAttributes.endDate.title}>
              {serviceContainerProductMilestone.data?.endDate && (
                <DateTime date={serviceContainerProductMilestone.data.endDate} displayTime={false} />
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <CardFlex>
          <CardFlexItem description={<div>The number of Artifacts produced by Builds contained in this Milestone.</div>}>
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts built in this Milestone">
                {serviceContainerStatistics.data?.artifactsInMilestone}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts built in this Milestone</CardTitle>
          </CardFlexItem>
          <CardFlexItem
            description={<div>The number of Delivered Artifacts produced by Builds contained in this Milestone.</div>}
          >
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
          <CardFlexItem
            description={
              <div>
                The number of Delivered Artifacts produced by Builds contained in previous Milestones of the same Product.
              </div>
            }
          >
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Delivered Artifacts built in other Milestones"
              >
                {serviceContainerStatistics.data?.deliveredArtifactsSource.otherMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Delivered Artifacts built in other Milestones</CardTitle>
          </CardFlexItem>
          <CardFlexItem
            description={
              <div>The number of Delivered Artifacts produced by Builds contained in Milestones of other Products.</div>
            }
          >
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
          <CardFlexItem
            description={
              <div>
                The number of Delived Artifacts produced by Builds not contained in any Milestone. This may include Artifacts from
                Brew.
              </div>
            }
          >
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
          <CardFlexItem
            description={
              <div>The number of Delivered Artifacts not produced in any Build. Non-zero value may indicate a problem.</div>
            }
          >
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
              data={dougnutChartArtifactQuality.data}
              labels={dougnutChartArtifactQuality.labels}
              colors={dougnutChartArtifactQuality.labels?.map((label) => artifactQualityColorMap[label]?.hexColor)}
              description={<div>Chart displays proportion of quality of Delivered Artifacts.</div>}
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
              data={dougnutChartRepositoryType.data}
              labels={dougnutChartRepositoryType.labels}
              colors={dougnutChartRepositoryType.labels?.map((label) => repositoryTypeColorMap[label]?.hexColor)}
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
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
