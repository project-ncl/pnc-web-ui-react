import { NavigateFunction, Location } from 'react-router-dom';

/*
 * URL Query Params are considered to be the Single Point of Truth.
 */

/**
 * @example
 * { 'component1-pageSize': 10, 'component2-pageIndex': 1}
 */
export interface IQueryParamsObject {
  [key: string]: string | number;
}

/**
 * Transforms URL Query Params from string to object.
 *
 * @example
 * ```ts
 * // from:
 *   ?component1-pageIndex=1&component2-pageSize=10
 * // to:
 *   { 'component1-pageIndex': 1, 'component2-pageSize': 10}
 * ```
 *
 * @param queryParamsString - URL Query Params in string representation
 * @returns URL Query Params in object representation
 */
export const parseQueryParamsToObject = (queryParamsString: string): IQueryParamsObject => {
  const searchParams = new URLSearchParams(queryParamsString);
  const queryParamsObject: IQueryParamsObject = {};

  for (const [key, value] of searchParams) {
    /**
     * + operator returns the numeric value of the string or NaN
     *
     * examples:
     *  +'12' returns 12
     *  +'12px' returns NaN
     *  +'foo' returns NaN
     */
    if (Number.isInteger(+value)) {
      queryParamsObject[key] = Number(value);
    } else {
      queryParamsObject[key] = value;
    }
  }

  return queryParamsObject;
};

/**
 * Update Query Params contained in the URL.
 *
 * @example
 * ```ts
 * // from:
 *   { 'pageIndex': 1 }
 * // to (for component1):
 *   ?component1-pageIndex=1
 * ```
 *
 * @param queryParamsObject - URL Query Params in object representation
 * @param componentId - Component string identifier to distinguish individual Query Params
 * @param location - Location interface from the history library, see https://reactrouter.com/docs/en/v6/api#location
 * @param navigate - Function that lets you navigate programmatically, see https://reactrouter.com/docs/en/v6/api#usenavigate
 * @param replace - When true it replaces the current entry on the history stack, otherwise it pushes a new entry onto the history stack by default
 */
export const updateQueryParamsInURL = (
  queryParamsObject: IQueryParamsObject,
  componentId: string,
  location: Location,
  navigate: NavigateFunction,
  replace: boolean = false
) => {
  let searchParams = new URLSearchParams(location.search);

  // add componentId prefix to all keys
  for (const [key, value] of Object.entries(queryParamsObject)) {
    // set Query Params and delete duplicates if any
    searchParams.set(`${componentId}-${key}`, String(value));
  }

  // #render
  navigate(
    {
      search: searchParams.toString(),
    },
    { replace }
  );
};

/**
 * Return Query Params object without componentId prefixes retrieved from the URL for given component.
 *
 * @example
 * ```ts
 * // from:
 *   ?component1-pageIndex=1&component2-pageSize=10
 * // to (for component1):
 *   { 'pageIndex': 1}
 * ```
 *
 * @param queryParamsString - URL Query Params in string representation
 * @param componentId - Component string identifier to distinguish individual component related Query Params
 * @returns URL Query Params in object representation without componentId prefixes
 */
export const getComponentQueryParamsObject = (queryParamsString: string, componentId: string): IQueryParamsObject => {
  const queryParamsObject = parseQueryParamsToObject(queryParamsString);

  // get Query Params that belong to the given component
  const componentQueryParamsObject: IQueryParamsObject = {};
  Object.keys(queryParamsObject).forEach((keyWithPrefix) => {
    const [prefix, keyWithoutPrefix, ...rest] = keyWithPrefix.split('-');

    if (rest.length) {
      throw new Error('Exactly one occurrence of "-" is expected in Query Params keys');
    }

    if (prefix === componentId) {
      componentQueryParamsObject[keyWithoutPrefix] = queryParamsObject[keyWithPrefix];
    }
  });

  return componentQueryParamsObject;
};

/**
 * Compare two Query Params objects.
 *
 * @param queryParams1 - Query Params object 1
 * @param queryParams2 - Query Params object 2
 * @returns true when objects are identical, otherwise false
 */
export const queryParamsObjectsAreEqual = (queryParams1: IQueryParamsObject, queryParams2: IQueryParamsObject) => {
  const queryParams1Keys = Object.keys(queryParams1);
  if (queryParams1Keys.length === Object.keys(queryParams2).length) {
    for (const key of queryParams1Keys) {
      if (queryParams1[key] !== queryParams2[key]) {
        return false;
      }
    }
    return true;
  }
  return false;
};
