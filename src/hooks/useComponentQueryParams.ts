import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import {
  IQueryParamsObject,
  convertComponentQueryParamsObjectToString,
  getComponentQueryParamsObject,
  queryParamsObjectsAreEqual,
} from 'utils/queryParamsHelper';

/**
 * Hook returning new URL Query Params when new version is available.
 *
 * @param componentId - component ID used when parsing component related Query Params from the URL
 * @returns Up-to-date URL Query Params in its object and string representation
 */
export const useComponentQueryParams = (componentId: string) => {
  const location = useLocation();
  const locationSearch: string = location.search;

  const [componentQueryParamsObjectState, setComponentQueryParamsObjectState] = useState<IQueryParamsObject | null>(null);
  const [componentQueryParamsStringState, setComponentQueryParamsStringState] = useState<string>('');

  // null = service was not executed yet
  // {} = service was already executed, but no component Query Params were available in the URL
  const lastComponentQueryParamsObject = useRef<IQueryParamsObject | null>(null);

  useEffect(() => {
    const componentQueryParamsObject = getComponentQueryParamsObject(locationSearch, componentId);

    if (!queryParamsObjectsAreEqual(lastComponentQueryParamsObject.current, componentQueryParamsObject)) {
      lastComponentQueryParamsObject.current = componentQueryParamsObject;
      setComponentQueryParamsObjectState(componentQueryParamsObject);
      setComponentQueryParamsStringState(convertComponentQueryParamsObjectToString(componentQueryParamsObject, componentId));
    }
  }, [componentId, locationSearch]);

  return {
    componentQueryParamsObject: componentQueryParamsObjectState,
    componentQueryParamsString: componentQueryParamsStringState,
  };
};
