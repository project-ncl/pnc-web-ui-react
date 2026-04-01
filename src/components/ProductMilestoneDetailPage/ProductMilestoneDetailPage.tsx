import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect, useMemo } from 'react';

import { artifactQualityColorMap, repositoryTypeColorMap } from 'common/colorMap';
import { deliveredArtifactsSourceDescriptions } from 'common/deliveredArtifactsSourceDescriptions';
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
import { WarningIcon } from 'components/Icons/WarningIcon';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import {
  BuiltInOtherMilestonesFilteringPresetLink,
  BuiltInOtherProductsFilteringPresetLink,
  BuiltInThisMilestoneFilteringPresetLink,
  BuiltOutsideMilestoneFilteringPresetLink,
  NotBuiltFilteringPresetLink,
} from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactListFilteringPresetLink';
import { productMilestoneDeliveredArtifactsPageComponentId } from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactsPage';
import { getDeliveredArtifactsNonZeroValueWarning } from 'components/ProductMilestoneDeliveredArtifactsPage/common';
import { useServiceContainerProductMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { doughnutChartDataTransform, doughnutChartLabelTransform } from 'utils/dataTransformHelper';

const PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH = '../delivered-artifacts';

export const ProductMilestoneDetailPage = () => {
  const { productMilestoneId, productId } = useParamsRequired();

  const { serviceContainerProductMilestone } = useServiceContainerProductMilestone();

  const serviceContainerStatistics = useServiceContainer(productMilestoneApi.getStatistics);
  const serviceContainerStatisticsRunner = serviceContainerStatistics.run;

  const doughnutChartArtifactQuality = useMemo(
    () => ({
      data: doughnutChartDataTransform(serviceContainerStatistics.data?.artifactQuality),
      labels: doughnutChartLabelTransform(serviceContainerStatistics.data?.artifactQuality),
    }),
    [serviceContainerStatistics.data]
  );

  const doughnutChartArtifactQualityColors = useMemo(
    () => doughnutChartArtifactQuality.labels?.map((label) => artifactQualityColorMap[label]?.hexColor),
    [doughnutChartArtifactQuality.labels]
  );

  const doughnutChartRepositoryType = useMemo(
    () => ({
      data: doughnutChartDataTransform(serviceContainerStatistics.data?.repositoryType),
      labels: doughnutChartLabelTransform(serviceContainerStatistics.data?.repositoryType),
    }),
    [serviceContainerStatistics.data]
  );

  const doughnutChartRepositoryTypeColors = useMemo(
    () => doughnutChartRepositoryType.labels?.map((label) => repositoryTypeColorMap[label]?.hexColor),
    [doughnutChartRepositoryType.labels]
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

          <CardFlexItem description={<div>The number of {deliveredArtifactsSourceDescriptions.thisMilestone.description}</div>}>
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title={deliveredArtifactsSourceDescriptions.thisMilestone.title}
              >
                <BuiltInThisMilestoneFilteringPresetLink
                  componentId={productMilestoneDeliveredArtifactsPageComponentId}
                  basePath={PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH}
                  productMilestoneId={productMilestoneId}
                >
                  {serviceContainerStatistics.data?.deliveredArtifactsSource.thisMilestone}
                </BuiltInThisMilestoneFilteringPresetLink>
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>{deliveredArtifactsSourceDescriptions.thisMilestone.title}</CardTitle>
          </CardFlexItem>

          <CardFlexItem description={<div>The number of {deliveredArtifactsSourceDescriptions.otherMilestones.description}</div>}>
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title={deliveredArtifactsSourceDescriptions.otherMilestones.title}
              >
                <BuiltInOtherMilestonesFilteringPresetLink
                  componentId={productMilestoneDeliveredArtifactsPageComponentId}
                  basePath={PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH}
                  productMilestoneId={productMilestoneId}
                  productId={productId}
                >
                  {serviceContainerStatistics.data?.deliveredArtifactsSource.otherMilestones}
                </BuiltInOtherMilestonesFilteringPresetLink>
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>{deliveredArtifactsSourceDescriptions.otherMilestones.title}</CardTitle>
          </CardFlexItem>

          <CardFlexItem description={<div>The number of {deliveredArtifactsSourceDescriptions.otherProducts.description}</div>}>
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title={deliveredArtifactsSourceDescriptions.otherProducts.title}
              >
                <BuiltInOtherProductsFilteringPresetLink
                  componentId={productMilestoneDeliveredArtifactsPageComponentId}
                  basePath={PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH}
                  productId={productId}
                >
                  {serviceContainerStatistics.data?.deliveredArtifactsSource.otherProducts}
                </BuiltInOtherProductsFilteringPresetLink>
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>{deliveredArtifactsSourceDescriptions.otherProducts.title}</CardTitle>
          </CardFlexItem>

          <CardFlexItem description={<div>The number of {deliveredArtifactsSourceDescriptions.noMilestone.description}</div>}>
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title={deliveredArtifactsSourceDescriptions.noMilestone.title}
              >
                <BuiltOutsideMilestoneFilteringPresetLink
                  componentId={productMilestoneDeliveredArtifactsPageComponentId}
                  basePath={PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH}
                >
                  {serviceContainerStatistics.data?.deliveredArtifactsSource.noMilestone}
                </BuiltOutsideMilestoneFilteringPresetLink>
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>{deliveredArtifactsSourceDescriptions.noMilestone.title}</CardTitle>
          </CardFlexItem>

          <CardFlexItem
            description={
              <div>
                The number of {deliveredArtifactsSourceDescriptions.noBuild.description}{' '}
                {getDeliveredArtifactsNonZeroValueWarning(
                  false,
                  serviceContainerStatistics.data?.deliveredArtifactsSource.noBuild
                )}
              </div>
            }
          >
            <CardValue>
              <ServiceContainerLoading
                {...serviceContainerStatistics}
                variant="icon"
                title={deliveredArtifactsSourceDescriptions.noBuild.title}
              >
                <NotBuiltFilteringPresetLink
                  componentId={productMilestoneDeliveredArtifactsPageComponentId}
                  basePath={PRODUCT_MILESTONE_DELIVERED_ARTIFACTS_PATH}
                >
                  {serviceContainerStatistics.data?.deliveredArtifactsSource.noBuild}
                </NotBuiltFilteringPresetLink>{' '}
                {serviceContainerStatistics.data?.deliveredArtifactsSource.noBuild > 0 && (
                  <WarningIcon
                    tooltip={getDeliveredArtifactsNonZeroValueWarning(
                      true,
                      serviceContainerStatistics.data?.deliveredArtifactsSource.noBuild
                    )}
                  />
                )}
              </ServiceContainerLoading>
            </CardValue>
            <CardTitle>{deliveredArtifactsSourceDescriptions.noBuild.title}</CardTitle>
          </CardFlexItem>
        </CardFlex>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Artifact Quality Distribution" />
          </ToolbarItem>
        </Toolbar>
        <ContentBox contentBoxHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} hasSkeleton title="Artifact Quality Distribution">
            <DoughnutChart
              data={doughnutChartArtifactQuality.data}
              labels={doughnutChartArtifactQuality.labels}
              colors={doughnutChartArtifactQualityColors}
              description={<div>Chart displays proportion of quality of Delivered Artifacts.</div>}
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem sm={12} lg={6}>
        <Toolbar>
          <ToolbarItem>
            <PageSectionHeader title="Repository Type Distribution" />
          </ToolbarItem>
        </Toolbar>
        <ContentBox contentBoxHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} hasSkeleton title="Repository Type Distribution">
            <DoughnutChart
              data={doughnutChartRepositoryType.data}
              labels={doughnutChartRepositoryType.labels}
              colors={doughnutChartRepositoryTypeColors}
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
