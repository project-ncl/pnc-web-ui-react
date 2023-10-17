import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProductMilestoneCloseResultsList } from 'components/ProductMilestoneCloseResultsList/ProductMilestoneCloseResultsList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneCloseResultsPageProps {
  componentId?: string;
}

export const ProductMilestoneCloseResultsPage = ({ componentId = 'c1' }: IProductMilestoneCloseResultsPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerCloseResults = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerCloseResultsRunner = serviceContainerCloseResults.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerCloseResultsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    {
      componentId,
      mandatoryQueryParams: { pagination: true, sorting: true },
    }
  );

  return <ProductMilestoneCloseResultsList {...{ serviceContainerCloseResults, componentId }} />;
};
