import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
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

  useEffect(() => {
    serviceContainerCloseResultsRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: { params: { latest: true } },
    });
  }, [serviceContainerCloseResultsRunner, productMilestoneId]);

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
    <ContentBox padding marginBottom>
      <AttributesItems attributes={attributes} />
    </ContentBox>
  );
};
