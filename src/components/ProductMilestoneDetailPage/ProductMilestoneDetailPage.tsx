import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { CardFlex } from 'components/CardFlex/CardFlex';
import { CardFlexItem, ExtraLargeCardText, LargeCardText } from 'components/CardFlexItem/CardFlexItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DoughnutChart } from 'components/DoughnutChart/DoughnutChart';
import { ProductMilestoneCloseStatusLabel } from 'components/ProductMilestoneCloseStatusLabel/ProductMilestoneCloseStatusLabel';
import { useServiceContainerMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

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
        <ContentBox contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} title="Chart">
            <DoughnutChart
              data={serviceContainerStatistics.data?.artifactQuality}
              title="Artifact Quality Distribution"
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
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>

      <GridItem span={6}>
        <ContentBox contentHeight="500px">
          <ServiceContainerLoading {...serviceContainerStatistics} title="Chart">
            <DoughnutChart
              data={serviceContainerStatistics.data?.repositoryType}
              title="Repository Type Distribution"
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
            />
          </ServiceContainerLoading>
        </ContentBox>
      </GridItem>
    </Grid>
  );
};
