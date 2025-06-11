import { Text, TextContent } from '@patternfly/react-core';
import { useCallback } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasDeliverableAnalysisChanged, hasDeliverableAnalysisStarted, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { DeliverableAnalysesList } from 'components/DeliverableAnalysesList/DeliverableAnalysesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { refreshPage } from 'utils/refreshHelper';

interface IProductMilestoneDeliverableAnalysesPage {
  componentId?: string;
}

export const ProductMilestoneDeliverableAnalysesPage = ({ componentId = 'c1' }: IProductMilestoneDeliverableAnalysesPage) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: deliverableAnalysesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerDeliverableAnalyses = useServiceContainer(productMilestoneApi.getDeliverableAnalyses);
  const serviceContainerDeliverableAnalysesRunner = serviceContainerDeliverableAnalyses.run;
  const serviceContainerDeliverableAnalysesSetter = serviceContainerDeliverableAnalyses.setData;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerDeliverableAnalysesRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
      [serviceContainerDeliverableAnalysesRunner, productMilestoneId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasDeliverableAnalysisStarted(wsData, { productMilestoneId })) {
          serviceContainerDeliverableAnalysesRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: deliverableAnalysesQueryParamsObject },
          });
        } else if (hasDeliverableAnalysisChanged(wsData, { productMilestoneId })) {
          const wsOperation: DeliverableAnalyzerOperation = wsData.operation;
          serviceContainerDeliverableAnalysesSetter((previousPage) => refreshPage(previousPage!, wsOperation));
        }
      },
      [
        serviceContainerDeliverableAnalysesRunner,
        serviceContainerDeliverableAnalysesSetter,
        deliverableAnalysesQueryParamsObject,
        productMilestoneId,
      ]
    )
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component="h2">Deliverable Analyses</Text>
            <Text>This list contains Analyses of the deliverables produced in the Milestone.</Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>
      <DeliverableAnalysesList {...{ serviceContainerDeliverableAnalyses, componentId }} />
    </>
  );
};
