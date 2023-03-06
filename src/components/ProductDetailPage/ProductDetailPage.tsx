import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductVersionsList } from 'components/ProductVersionsList/ProductVersionsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productsApi from 'services/productsApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductDetailPageProps {
  componentId?: string;
}

export const ProductDetailPage = ({ componentId = 'v1' }: IProductDetailPageProps) => {
  const { productId } = useParams();

  const serviceContainerProduct = useServiceContainer(productsApi.getProduct);
  const serviceContainerProductRunner = serviceContainerProduct.run;

  const serviceContainerProductVersions = useServiceContainer(productsApi.getProductVersions);
  const serviceContainerProductVersionsRunner = serviceContainerProductVersions.run;

  useEffect(() => {
    serviceContainerProductRunner({ serviceData: { id: productId } });
  }, [serviceContainerProductRunner, productId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductVersionsRunner({ serviceData: { id: productId }, requestConfig }),
    {
      componentId,
      mandatoryQueryParams: { pagination: true, sorting: false },
    }
  );

  useTitle(generatePageTitle({ serviceContainer: serviceContainerProduct, firstLevelEntity: 'Product' }));

  const attributes = [
    { name: 'Abbreviation', value: serviceContainerProduct.data?.abbreviation },
    { name: 'Product Managers', value: serviceContainerProduct.data?.productManagers },
    { name: 'Product Pages Code', value: serviceContainerProduct.data?.productPagesCode },
  ];

  return (
    <ServiceContainerLoading {...serviceContainerProduct} title="Product details">
      <PageLayout
        title={serviceContainerProduct.data?.name}
        description={serviceContainerProduct.data?.description}
        actions={
          <ProtectedComponent>
            <ActionButton action={() => console.log('Not implemented yet!')}>Edit Product</ActionButton>
          </ProtectedComponent>
        }
      >
        <ContentBox padding marginBottom>
          <AttributesItems attributes={attributes} />
        </ContentBox>

        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Product Versions</Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem alignRight>
            <ProtectedComponent>
              <ActionButton action={() => console.log('Not implemented yet!')}>Create Version</ActionButton>
            </ProtectedComponent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop>
          <ProductVersionsList {...{ serviceContainerProductVersions, componentId }} />
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
