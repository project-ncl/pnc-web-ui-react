import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProductVersionReleasesList } from 'components/ProductVersionReleasesList/ProductVersionReleasesList';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionReleasesPageProps {
  componentId?: string;
}

export const ProductVersionReleasesPage = ({ componentId = 'r1' }: IProductVersionReleasesPageProps) => {
  const { productVersionId } = useParams();

  const serviceContainerProductReleases = useServiceContainer(productVersionApi.getProductReleases);
  const serviceContainerProductReleasesRunner = serviceContainerProductReleases.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductReleasesRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return <ProductVersionReleasesList {...{ serviceContainerProductReleases, componentId }} />;
};
