import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ProtectedActionButton } from 'components/ActionButton/ActionButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductsList } from 'components/ProductsList/ProductsList';

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
          This page contains list of Products like <Label>EAP</Label>. Usually, Product is a deliverable package composed of
          multiple Projects like <Label>JBoss Modules</Label> or <Label>Hibernate</Label>.
        </>
      }
      actions={
        <ProtectedActionButton variant="primary" link="create">
          Create Product
        </ProtectedActionButton>
      }
    >
      <ProductsList {...{ serviceContainerProducts, componentId }} />
    </PageLayout>
  );
};
