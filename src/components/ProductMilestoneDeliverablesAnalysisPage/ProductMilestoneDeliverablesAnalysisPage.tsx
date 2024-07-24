import { useCallback } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import {
  hasDeliverablesAnalysisChanged,
  hasDeliverablesAnalysisStarted,
  usePncWebSocketEffect,
} from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProductMilestoneDeliverablesAnalysisList } from 'components/ProductMilestoneDeliverablesAnalysisList/ProductMilestoneDeliverablesAnalysisList';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { refreshPage } from 'utils/refreshHelper';

interface IProductMilestoneDeliverablesAnalysisPage {
  componentId?: string;
}

export const ProductMilestoneDeliverablesAnalysisPage = ({ componentId = 'c1' }: IProductMilestoneDeliverablesAnalysisPage) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: deliverablesAnalysesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerDeliverablesAnalysis = useServiceContainer(productMilestoneApi.getDeliverablesAnalysis);
  const serviceContainerDeliverablesAnalysisRunner = serviceContainerDeliverablesAnalysis.run;
  const serviceContainerDeliverablesAnalysisSetter = serviceContainerDeliverablesAnalysis.setData;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerDeliverablesAnalysisRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
      [serviceContainerDeliverablesAnalysisRunner, productMilestoneId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverablesAnalysisStarted(wsData, { productMilestoneId })) {
          serviceContainerDeliverablesAnalysisRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: deliverablesAnalysesQueryParamsObject },
          });
        } else if (hasDeliverablesAnalysisChanged(wsData, { productMilestoneId })) {
          const wsOperation: DeliverableAnalyzerOperation = wsData.operation;
          serviceContainerDeliverablesAnalysisSetter((previousPage) => refreshPage(previousPage!, wsOperation));
        }
      },
      [
        serviceContainerDeliverablesAnalysisRunner,
        serviceContainerDeliverablesAnalysisSetter,
        deliverablesAnalysesQueryParamsObject,
        productMilestoneId,
      ]
    )
  );

  return <ProductMilestoneDeliverablesAnalysisList {...{ serviceContainerDeliverablesAnalysis, componentId }} />;
};
