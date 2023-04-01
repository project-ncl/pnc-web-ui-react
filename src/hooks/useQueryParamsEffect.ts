import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { ServiceContainerRunnerFunction } from 'hooks/useServiceContainer';

import { IQueryParamsObject, getComponentQueryParamsObject, queryParamsObjectsAreEqual } from 'utils/queryParamsHelper';

interface IMandatoryQueryParams {
  pagination?: boolean;
  sorting?: boolean;
  milestone?: boolean;
}

const listMandatoryQueryParams: IMandatoryQueryParams = { pagination: true, sorting: true };

const areMandatoryParamsAvailable = (mandatoryParams: IMandatoryQueryParams, componentQueryParamsObject: IQueryParamsObject) => {
  if (mandatoryParams.pagination && (!componentQueryParamsObject.pageIndex || !componentQueryParamsObject.pageSize)) {
    return false;
  }

  if (mandatoryParams.sorting && !componentQueryParamsObject.sort) {
    return false;
  }

  // Example usage: ProductMilestoneInterconnectionGraphPage
  if (mandatoryParams.milestone && (!componentQueryParamsObject.milestone1 || !componentQueryParamsObject.milestone2)) {
    return false;
  }

  return true;
};

/**
 * Hook executing provided service with several features:
 *  - passing component related Query Params as method arguments
 *  - preventing executing service when it's not necessary, for example
 *    - service was already executed and there were no component related URL changes (like pagination index change, etc)
 *    - service execution should wait until all mandatory Query Params are available in the URL
 *
 * @param service - Service to be executed
 * @param additionalData
 *   componentId - component ID used when parsing component related Query Parameters from the URL
 *   mandatoryQueryParams - Query Parameters required to be present in the URL before service method can be executed
 */
export const useQueryParamsEffect = (
  service: ServiceContainerRunnerFunction,
  {
    componentId = '',
    mandatoryQueryParams = listMandatoryQueryParams,
  }: {
    componentId?: string;
    mandatoryQueryParams?: IMandatoryQueryParams;
  } = {}
) => {
  // null = service was not executed yet
  // {} = service was already executed, but no component Query Parameters were available in the URL
  const lastQueryParams = useRef<IQueryParamsObject | null>(null);

  const location = useLocation();

  useEffect(() => {
    const componentQueryParamsObject = getComponentQueryParamsObject(location.search, componentId);

    // Invoke service only when:
    if (
      // 1) Query Params were changed
      !queryParamsObjectsAreEqual(lastQueryParams.current, componentQueryParamsObject) &&
      // 2) and all mandatory Query Parameters are available in the URL
      areMandatoryParamsAvailable(mandatoryQueryParams, componentQueryParamsObject)
    ) {
      lastQueryParams.current = componentQueryParamsObject;
      // Put Query Params coming from the URL to the service
      service({ requestConfig: { params: componentQueryParamsObject } });
    }
  }, [location.search, componentId, service, mandatoryQueryParams]);
};
