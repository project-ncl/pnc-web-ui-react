import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductsList } from 'components/ProductsList/ProductsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

import * as productApi from 'services/productApi';

interface IProductsPageProps {
  componentId?: string;
}

export const ProductsPage = ({ componentId = 'p1' }: IProductsPageProps) => {
  const serviceContainerProducts = useServiceContainer(productApi.getProducts);

  useQueryParamsEffect(serviceContainerProducts.run, { componentId });

  useTitle(PageTitles.products);

  return (
    <PageLayout
      title={PageTitles.products}
      description={
        <>
          This page contains list of products like <Label>EAP</Label>, usually product is a deliverable package composed of
          multiple projects like <Label>JBoss Modules</Label> or <Label>Hibernate</Label>.
        </>
      }
      actions={
        <ProtectedComponent>
          <ActionButton action={() => console.log('Not implemented yet!')}>Create Product</ActionButton>
        </ProtectedComponent>
      }
    >
      <ContentBox shadow={false} background={false} marginBottom>
        <ProductsList {...{ serviceContainerProducts, componentId }} />
      </ContentBox>

      <ContentBox padding>
        <ActionButton link="/products/100/versions/100/milestones/101/details">Product Milestone (testing purposes)</ActionButton>
      </ContentBox>
    </PageLayout>
  );
};
