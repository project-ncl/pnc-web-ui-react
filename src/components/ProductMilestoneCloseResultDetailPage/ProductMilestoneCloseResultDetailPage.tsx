import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { productMilestoneCloseResultEntityAttributes } from 'common/productMilestoneCloseResultEntityAttributes';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProductMilestoneCloseStatusLabelMapper } from 'components/LabelMapper/ProductMilestoneCloseStatusLabelMapper';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime } from 'utils/utils';

export const ProductMilestoneCloseResultDetailPage = () => {
  const { productMilestoneId } = useParams();
  const { closeResultId } = useParams();

  const serviceContainerProdutMilestoneCloseResult = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerProdutMilestoneCloseResultRunner = serviceContainerProdutMilestoneCloseResult.run;

  const closeResult: ProductMilestoneCloseResult = serviceContainerProdutMilestoneCloseResult.data?.content[0];

  useEffect(() => {
    serviceContainerProdutMilestoneCloseResultRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: {
        params: {
          q: `id==${closeResultId}`,
        },
      },
    });
  }, [serviceContainerProdutMilestoneCloseResultRunner, productMilestoneId, closeResultId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProdutMilestoneCloseResult,
      firstLevelEntity: 'Product',
      nestedEntity: 'Close Result',
      entityName: `Close Result ${PageTitles.delimiterSymbol} ${closeResult?.milestone?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProdutMilestoneCloseResult} title="Product Milestone Close Result details">
      <PageLayout title="Close Result">
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.id.title}>{closeResult?.id}</AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.status.title}>
              <ProductMilestoneCloseStatusLabelMapper status={closeResult?.status} />
            </AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.startingDate.title}>
              {closeResult?.startingDate && createDateTime({ date: closeResult.startingDate }).custom}
            </AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.endDate.title}>
              {closeResult?.endDate && createDateTime({ date: closeResult.endDate }).custom}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* TODO: Pushed Builds list*/}

        {/* TODO: Log*/}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
