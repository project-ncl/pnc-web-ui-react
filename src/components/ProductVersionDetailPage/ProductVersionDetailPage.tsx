import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ProductMilestoneRef, ProductReleaseRef } from 'pnc-api-types-ts';

import { ProductVersionAttributes } from 'common/ProductVersionAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem } from 'components/CardFlex/CardFlexItem';
import { CardTitle } from 'components/CardFlex/CardTitle';
import { CardValue } from 'components/CardFlex/CardValue';
import { StackedBarChart } from 'components/Charts/StackedBarChart';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Pagination } from 'components/Pagination/Pagination';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { useServiceContainerProductVersion } from 'components/ProductVersionPages/ProductVersionPages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

import { stackedBarChartDataTransform, stackedBarChartHeight, stackedBarChartLabelTransform } from 'utils/dataTransformHelper';

export const ProductVersionDetailPage = () => {
  const { productVersionId } = useParams();

  const { serviceContainerProductVersion } = useServiceContainerProductVersion();

  const serviceContainerStatistics = useServiceContainer(productVersionApi.getStatistics);
  const serviceContainerStatisticsRunner = serviceContainerStatistics.run;

  const serviceContainerArtifactQualityStatistics = useServiceContainer(productVersionApi.getArtifactQualityStatistics);
  const serviceContainerArtifactQualityStatisticsRunner = serviceContainerArtifactQualityStatistics.run;

  const serviceContainerRepositoryTypeStatistics = useServiceContainer(productVersionApi.getRepositoryTypeStatistics);
  const serviceContainerRepositoryTypeStatisticsRunner = serviceContainerRepositoryTypeStatistics.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerArtifactQualityStatisticsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    {
      componentId: 'ch1',
      mandatoryQueryParams: { pagination: true, sorting: false },
    }
  );

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerRepositoryTypeStatisticsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    {
      componentId: 'ch2',
      mandatoryQueryParams: { pagination: true, sorting: false },
    }
  );

  useEffect(() => {
    serviceContainerStatisticsRunner({
      serviceData: { id: productVersionId },
    });
  }, [serviceContainerStatisticsRunner, productVersionId]);

  const latestProductMilestone: ProductMilestoneRef =
    serviceContainerProductVersion.data?.productMilestones &&
    Object.values(serviceContainerProductVersion.data.productMilestones).at(-1);
  const latestProductRelease: ProductReleaseRef =
    serviceContainerProductVersion.data?.productReleases &&
    Object.values(serviceContainerProductVersion.data.productReleases).at(-1);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding>
          <Attributes>
            <AttributesItem title={ProductVersionAttributes.version.title}>
              {serviceContainerProductVersion.data?.version}
            </AttributesItem>
            <AttributesItem title={ProductVersionAttributes.productName.title}>
              {serviceContainerProductVersion.data?.product.name}
            </AttributesItem>
            <AttributesItem title={ProductVersionAttributes.productDescription.title}>
              {serviceContainerProductVersion.data?.product.description}
            </AttributesItem>
            <AttributesItem title={ProductVersionAttributes.breTagPrefix.title}>
              {serviceContainerProductVersion.data?.attributes.BREW_TAG_PREFIX}
            </AttributesItem>
            <AttributesItem title={ProductVersionAttributes.latestProductMilestone.title}>
              {latestProductMilestone && (
                <ProductMilestoneReleaseLabel
                  link={`../milestones/${latestProductMilestone.id}`}
                  productMilestoneRelease={latestProductMilestone}
                  isCurrent={latestProductMilestone.id === serviceContainerProductVersion.data?.currentProductMilestone?.id}
                />
              )}
            </AttributesItem>
            <AttributesItem title={ProductVersionAttributes.latestProductRelease.title}>
              {latestProductRelease && (
                <ProductMilestoneReleaseLabel productMilestoneRelease={latestProductRelease} isCurrent={false} />
              )}
            </AttributesItem>
          </Attributes>
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <CardFlex>
          <CardFlexItem>
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Milestones">
                {serviceContainerStatistics.data?.milestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Milestones</CardTitle>
          </CardFlexItem>
          <CardFlexItem>
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Product dependencies">
                {serviceContainerStatistics.data?.productDependencies}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Product dependencies</CardTitle>
          </CardFlexItem>
          <CardFlexItem>
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Milestone dependencies">
                {serviceContainerStatistics.data?.milestoneDependencies}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Milestone dependencies</CardTitle>
          </CardFlexItem>
          <CardFlexItem>
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title="Artifacts built in milestones of this version"
              >
                {serviceContainerStatistics.data?.artifactSource.thisVersionMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts built in milestones of this version</CardTitle>
          </CardFlexItem>
          <CardFlexItem>
            <CardValue>
              <ServiceContainerLoading {...serviceContainerStatistics} variant="icon" title="Artifacts built in other milestones">
                {serviceContainerStatistics.data?.artifactSource.otherMilestones}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>Artifacts built in other milestones</CardTitle>
          </CardFlexItem>
        </CardFlex>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Product Milestone Artifact Quality Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight={stackedBarChartHeight(serviceContainerArtifactQualityStatistics.data?.content)}>
          <ServiceContainerLoading
            {...serviceContainerArtifactQualityStatistics}
            hasSkeleton
            title="Product Milestone Artifact Quality Distribution"
          >
            <StackedBarChart
              labels={stackedBarChartLabelTransform(serviceContainerArtifactQualityStatistics.data?.content)}
              data={stackedBarChartDataTransform(serviceContainerArtifactQualityStatistics.data?.content, 'artifactQuality')}
              description="Chart displays proportion of quality of Delivered Artifacts among Product Milestones."
            />
          </ServiceContainerLoading>
        </ContentBox>
        <Pagination componentId="ch1" count={serviceContainerArtifactQualityStatistics.data?.totalHits} />
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Product Milestone Repository Type Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight={stackedBarChartHeight(serviceContainerRepositoryTypeStatistics.data?.content)}>
          <ServiceContainerLoading
            {...serviceContainerRepositoryTypeStatistics}
            hasSkeleton
            title="Product Milestone Repository Type Distribution"
          >
            <StackedBarChart
              labels={stackedBarChartLabelTransform(serviceContainerRepositoryTypeStatistics.data?.content)}
              data={stackedBarChartDataTransform(serviceContainerRepositoryTypeStatistics.data?.content, 'repositoryType')}
              description={
                <div>
                  Chart displays proportion of repository type of Delivered Artifacts among product milestones.
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
        <Pagination componentId="ch2" count={serviceContainerRepositoryTypeStatistics.data?.totalHits} />
      </GridItem>
    </Grid>
  );
};
