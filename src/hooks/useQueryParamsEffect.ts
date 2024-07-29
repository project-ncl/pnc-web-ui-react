import { useEffect } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { IService, ServiceContainerRunnerFunction, TServiceData, TServiceParams } from 'hooks/useServiceContainer';

import { IQueryParamsObject } from 'utils/queryParamsHelper';

/**
 * Function returning void is used when no data are returned.
 * This typically happens when no service is passed, but callback updating state based on the URL.
 */
type ServiceContainerRunnerFunctionVoid<U extends TServiceParams> = (iService?: IService<U>) => void;

interface IMandatoryQueryParams {
  pagination?: boolean;
  sorting?: boolean;
  milestone?: boolean;
  buildDependency?: boolean;
}

export const listMandatoryQueryParams = {
  all: { pagination: true, sorting: true },
  pagination: { pagination: true, sorting: false },
  none: { pagination: false, sorting: false },
} as const;

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

  // Example usage: BuildArtifactDependencyGraphPage
  if (
    mandatoryParams.buildDependency &&
    (!componentQueryParamsObject.dependentBuild || !componentQueryParamsObject.dependencyBuild)
  ) {
    return false;
  }

  return true;
};

/**
 * Hook executing provided service with several features:
 *  - executing the service, passing component related Query Params as method arguments
 *    - executing the service if there were component related URL changes (like pagination index change, etc.)
 *    - service execution waits until all mandatory Query Params are available in the URL
 *
 * @param service - Service to be executed
 * @param additionalData
 *   componentId - component ID used when parsing component related Query Parameters from the URL
 *   mandatoryQueryParams - Query Parameters required to be present in the URL before service method can be executed
 */
export const useQueryParamsEffect = <T extends TServiceData, U extends TServiceParams>(
  service: ServiceContainerRunnerFunction<T, U> | ServiceContainerRunnerFunctionVoid<U>,
  {
    componentId = '',
    mandatoryQueryParams = listMandatoryQueryParams.all,
  }: {
    componentId?: string;
    mandatoryQueryParams?: IMandatoryQueryParams;
  } = {}
) => {
  const { componentQueryParamsObject } = useComponentQueryParams(componentId);

  useEffect(() => {
    // Invoke service only when:
    if (
      // - all mandatory Query Parameters are available in the URL
      componentQueryParamsObject &&
      areMandatoryParamsAvailable(mandatoryQueryParams, componentQueryParamsObject)
    ) {
      // Put Query Params coming from the URL to the service
      service({ requestConfig: { params: componentQueryParamsObject } });
    }
  }, [componentQueryParamsObject, service, mandatoryQueryParams]);
};
