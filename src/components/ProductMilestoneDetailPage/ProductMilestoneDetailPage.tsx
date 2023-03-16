import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem, ExtraLargeCardText, LargeCardText } from 'components/CardFlexItem/CardFlexItem';
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
              <ExtraLargeCardText>{serviceContainerStatistics.data?.artifactSource.thisMilestone}</ExtraLargeCardText>
              <LargeCardText>Artifact built in this Milestone</LargeCardText>
            </CardFlexItem>
            <CardFlexItem>
              <ExtraLargeCardText>{serviceContainerStatistics.data?.artifactSource.otherMilestones}</ExtraLargeCardText>
              <LargeCardText>Artifacts built in other Milestones</LargeCardText>
            </CardFlexItem>
            <CardFlexItem>
              <ExtraLargeCardText>{serviceContainerStatistics.data?.artifactSource.notBuilt}</ExtraLargeCardText>
              <LargeCardText>Artifacts not built in a Milestone</LargeCardText>
            </CardFlexItem>
            <CardFlexItem>
              <ExtraLargeCardText>{serviceContainerStatistics.data?.previousMilestones}</ExtraLargeCardText>
              <LargeCardText>Previous Milestones</LargeCardText>
            </CardFlexItem>
            <CardFlexItem>
              <ExtraLargeCardText>{serviceContainerStatistics.data?.artifactSource.previousMilestones}</ExtraLargeCardText>
              <LargeCardText>Artifacts from previous Milestones</LargeCardText>
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
