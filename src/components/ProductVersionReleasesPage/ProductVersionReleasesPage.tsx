import { Label } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { ProductVersionReleasesList } from 'components/ProductVersionReleasesList/ProductVersionReleasesList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionReleasesPageProps {
  componentId?: string;
}

export const ProductVersionReleasesPage = ({ componentId = 'r1' }: IProductVersionReleasesPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerProductReleases = useServiceContainer(productVersionApi.getProductReleases);
  const serviceContainerProductReleasesRunner = serviceContainerProductReleases.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerProductReleasesRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerProductReleasesRunner, productVersionId]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.pagination }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <PageSectionHeader
            title="Product Releases"
            description={
              <>
                Product Release represents the final release suffix of the parent Product Version like <Label>0.GA</Label>, for
                example Product Version of <Label>1.0.0.GA</Label>. Product Milestone needs to be created from existing Product
                Milestone.
              </>
            }
          />
        </ToolbarItem>
        <ToolbarItem alignRight>
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
