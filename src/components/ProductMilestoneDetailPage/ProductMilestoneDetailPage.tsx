import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
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

  const attributes = [
    {
      name: 'Status',
      value: serviceContainerMilestone.data?.endDate ? 'CLOSED' : 'OPEN',
    },
    {
      name: 'Start Date',
      value: createDateTime({ date: serviceContainerMilestone.data.startingDate, includeTime: false }),
    },
    {
      name: 'Planned End Date',
      value: createDateTime({ date: serviceContainerMilestone.data.plannedEndDate, includeTime: false }),
    },
    {
      name: 'End Date',
      value: createDateTime({ date: serviceContainerMilestone.data.endDate, includeTime: false }),
    },
    {
      name: 'Last Close Result',
      value: (
        <ServiceContainerLoading {...serviceContainerCloseResults} isInline title="Product Milestone latest close result">
          <ProductMilestoneCloseStatusLabel status={serviceContainerCloseResults.data?.content[0]?.status} />
        </ServiceContainerLoading>
      ),
    },
  ];

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <ContentBox padding>
          <AttributesItems attributes={attributes} />
        </ContentBox>
      </GridItem>

      <GridItem span={12}>
        <ServiceContainerLoading {...serviceContainerStatistics} title="Statistics">
          <CardFlex>
            <CardFlexItem>
              <CardValue>{serviceContainerStatistics.data?.artifactSource.thisMilestone}</CardValue>
              <CardDescription>Artifact built in this Milestone</CardDescription>
            </CardFlexItem>
            <CardFlexItem>
              <CardValue>{serviceContainerStatistics.data?.artifactSource.otherMilestones}</CardValue>
              <CardDescription>Artifacts built in other Milestones</CardDescription>
            </CardFlexItem>
            <CardFlexItem>
              <CardValue>{serviceContainerStatistics.data?.artifactSource.notBuilt}</CardValue>
              <CardDescription>Artifacts not built in a Milestone</CardDescription>
            </CardFlexItem>
            <CardFlexItem>
              <CardValue>{serviceContainerStatistics.data?.previousMilestones}</CardValue>
              <CardDescription>Previous Milestones</CardDescription>
            </CardFlexItem>
            <CardFlexItem>
              <CardValue>{serviceContainerStatistics.data?.artifactSource.previousMilestones}</CardValue>
              <CardDescription>Artifacts from previous Milestones</CardDescription>
            </CardFlexItem>
          </CardFlex>
        </ServiceContainerLoading>
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
          <ServiceContainerLoading {...serviceContainerStatistics} title="Artifact Quality Distribution">
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

      <GridItem span={6}>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Repository Chart Distribution</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} title="Repository Type Distribution">
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
