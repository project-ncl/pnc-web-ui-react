import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { queryParamsObjectsAreEqual, getComponentQueryParamsObject } from '../utils/queryParamsHelper';

export const useQueryParamsEffect = (service: Function, componentId: string) => {
  const lastQueryParams = useRef({});
  const location = useLocation();

  useEffect(() => {
    const componentQueryParamsObject = getComponentQueryParamsObject(location.search, componentId);
    // Prevent service invocation when no Query Params changed
    if (
      Object.keys(componentQueryParamsObject).length &&
      !queryParamsObjectsAreEqual(lastQueryParams.current, componentQueryParamsObject)
    ) {
      lastQueryParams.current = componentQueryParamsObject;
      // Put Query Params coming from the URL to the service
      service({ params: componentQueryParamsObject });
    }
  }, [location.search, componentId, service]);
};
