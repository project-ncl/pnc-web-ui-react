import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { IQueryParamsObject, getComponentQueryParamsObject, queryParamsObjectsAreEqual } from 'utils/queryParamsHelper';

/**
 * Hook returning new componentQueryParamsObject when new version is available.
 *
 * @param componentId - component ID used when parsing component related Query Params from the URL
 * @returns New componentQueryParamsObject
 */
export const useComponentQueryParams = (componentId: string) => {
  const location = useLocation();
  const locationSearch: string = location.search;

  const [componentQueryParamsObjectState, setComponentQueryParamsObjectState] = useState<IQueryParamsObject | null>(null);

  // null = service was not executed yet
  // {} = service was already executed, but no component Query Params were available in the URL
  const lastComponentQueryParamsObject = useRef<IQueryParamsObject | null>(null);

  useEffect(() => {
    const componentQueryParamsObject = getComponentQueryParamsObject(locationSearch, componentId);

    if (!queryParamsObjectsAreEqual(lastComponentQueryParamsObject.current, componentQueryParamsObject)) {
      lastComponentQueryParamsObject.current = componentQueryParamsObject;
      setComponentQueryParamsObjectState(componentQueryParamsObject);
    }
  }, [componentId, locationSearch]);

  return { componentQueryParamsObject: componentQueryParamsObjectState };
};
