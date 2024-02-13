import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasMilestoneCloseFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProductMilestoneCloseResultsList } from 'components/ProductMilestoneCloseResultsList/ProductMilestoneCloseResultsList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneCloseResultsPageProps {
  componentId?: string;
}

export const ProductMilestoneCloseResultsPage = ({ componentId = 'c1' }: IProductMilestoneCloseResultsPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: closeResultsQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerCloseResults = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerCloseResultsRunner = serviceContainerCloseResults.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerCloseResultsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    {
      componentId,
      mandatoryQueryParams: { pagination: true, sorting: true },
    }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasMilestoneCloseFinished(wsData, { productMilestoneId })) {
          serviceContainerCloseResultsRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: closeResultsQueryParamsObject },
          });
        }
      },
      [serviceContainerCloseResultsRunner, closeResultsQueryParamsObject, productMilestoneId]
    )
  );

  return <ProductMilestoneCloseResultsList {...{ serviceContainerCloseResults, componentId }} />;
};
