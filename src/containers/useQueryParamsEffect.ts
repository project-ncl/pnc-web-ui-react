import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { IQueryParamsObject, getComponentQueryParamsObject, queryParamsObjectsAreEqual } from '../utils/queryParamsHelper';

interface IMandatoryParams {
  pagination?: boolean;
  sorting?: boolean;
}

const defaultMandatoryParams: IMandatoryParams = { pagination: true, sorting: false };

const areMandatoryParamsAvailable = (mandatoryParams: IMandatoryParams, componentQueryParamsObject: IQueryParamsObject) => {
  if (mandatoryParams.pagination && (!componentQueryParamsObject.pageIndex || !componentQueryParamsObject.pageSize)) {
    return false;
  }

  if (mandatoryParams.sorting && !componentQueryParamsObject.sort) {
    return false;
  }

  return true;
};

export const useQueryParamsEffect = (
  service: Function,
  componentId: string,
  mandatoryParams: IMandatoryParams = defaultMandatoryParams
) => {
  const lastQueryParams = useRef({});
  const location = useLocation();

  useEffect(() => {
    const componentQueryParamsObject = getComponentQueryParamsObject(location.search, componentId);

    // Prevent service invocation:
    if (
      // 1) when no Query Params changed
      Object.keys(componentQueryParamsObject).length &&
      !queryParamsObjectsAreEqual(lastQueryParams.current, componentQueryParamsObject) &&
      // 2) until all mandatory Query Parameters are available in the URL
      areMandatoryParamsAvailable(mandatoryParams, componentQueryParamsObject)
    ) {
      lastQueryParams.current = componentQueryParamsObject;
      // Put Query Params coming from the URL to the service
      service({ params: componentQueryParamsObject });
    }
  }, [location.search, componentId, service, mandatoryParams]);
};
