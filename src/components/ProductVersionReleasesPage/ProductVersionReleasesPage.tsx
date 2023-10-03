import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProductVersionReleasesList } from 'components/ProductVersionReleasesList/ProductVersionReleasesList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionReleasesPageProps {
  componentId?: string;
}

export const ProductVersionReleasesPage = ({ componentId = 'r1' }: IProductVersionReleasesPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerProductReleases = useServiceContainer(productVersionApi.getProductReleases);
  const serviceContainerProductReleasesRunner = serviceContainerProductReleases.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductReleasesRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Product Releases</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton link="create">Create Release</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>
      <ContentBox borderTop>
        <ProductVersionReleasesList {...{ serviceContainerProductReleases, componentId }} />
      </ContentBox>
    </>
  );
};
