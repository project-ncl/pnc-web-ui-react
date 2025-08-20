import { Label } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';

import { breadcrumbData } from 'common/breadcrumbData';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ProtectedActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { ProductVersionsList } from 'components/ProductVersionsList/ProductVersionsList';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productApi from 'services/productApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductDetailPageProps {
  componentId?: string;
}

export const ProductDetailPage = ({ componentId = 'v1' }: IProductDetailPageProps) => {
  const { productId } = useParamsRequired();
  const serviceContainerProduct = useServiceContainer(productApi.getProduct);
  const serviceContainerProductRunner = serviceContainerProduct.run;

  const serviceContainerProductVersions = useServiceContainer(productApi.getProductVersions);
  const serviceContainerProductVersionsRunner = serviceContainerProductVersions.run;

  useEffect(() => {
    serviceContainerProductRunner({ serviceData: { id: productId } });
  }, [serviceContainerProductRunner, productId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerProductVersionsRunner({ serviceData: { id: productId }, requestConfig }),
      [serviceContainerProductVersionsRunner, productId]
    ),
    {
      componentId,
      mandatoryQueryParams: listMandatoryQueryParams.pagination,
    }
  );

  useTitle(generatePageTitle({ serviceContainer: serviceContainerProduct, firstLevelEntity: 'Product' }));

  return (
    <ServiceContainerLoading {...serviceContainerProduct} title="Product details">
      <PageLayout
        title={serviceContainerProduct.data?.name}
        description={serviceContainerProduct.data?.description}
        breadcrumbs={[{ entity: breadcrumbData.product.id, title: serviceContainerProduct.data?.name }]}
        actions={
          <ProtectedActionButton variant="primary" link="edit">
            Edit Product
          </ProtectedActionButton>
        }
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={productEntityAttributes.abbreviation.title}>
              {serviceContainerProduct.data?.abbreviation}
            </AttributesItem>
            <AttributesItem title={productEntityAttributes.productManagers.title}>
              {serviceContainerProduct.data?.productManagers}
            </AttributesItem>
            <AttributesItem title={productEntityAttributes.productPagesCode.title}>
              {serviceContainerProduct.data?.productPagesCode}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar>
          <ToolbarItem reservedWidth>
            <PageSectionHeader
              title="Product Versions"
              description={
                <>
                  Product Version represents one Product stream like <Label>6.3</Label> or <Label>7.4</Label>. Each Product can
                  contain multiple Product Versions and each Product Version can contain multiple Product Milestones.
                </>
              }
            />
          </ToolbarItem>
          <ToolbarItem alignRight>
            <ProtectedActionButton variant="secondary" link="versions/create">
              Create Version
            </ProtectedActionButton>
          </ToolbarItem>
        </Toolbar>

        <ProductVersionsList {...{ serviceContainerProductVersions, componentId }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};
