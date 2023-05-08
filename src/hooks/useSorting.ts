import { ISortBy, ThProps } from '@patternfly/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ISortGroupProps } from 'components/SortGroup/SortGroup';

import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';
import { validateSortParam } from 'utils/sortParamHelper';

/**
 * @example
 * {
 *   id: 'name',
 *   title: 'Name',
 *   tableColumnIndex: 0
 * }
 *
 * @example
 * {
 *   id: 'description',
 *   title: 'Description',
 *   tableColumnIndex: 1
 * }
 */
export interface ISortAttribute {
  /**
   * ID has to match object key {@link ISortAttributes}, there is automatic checker throwing errors if they don't match.
   */
  id: string;
  /**
   * Sorting option title.
   */
  title: string;
  /**
   * PatternFly requires to use table column indexes for sorting purposes.
   * See https://www.patternfly.org/v4/components/table/
   *
   * First column = 0, the second column = 1, etc.
   */
  tableColumnIndex: number;
  /**
   * Group of sorting attributes, typically used for sort icons.
   */
  sortGroup?: string;
}

/**
 * @example
 * {
 *   name: {ISortAttribute},
 *   description: {ISortAttribute}
 * }
 */
export interface ISortAttributes {
  [key: string]: ISortAttribute;
}

interface ISortFunctionOptions {
  sortAttribute?: string;
  sortDirection?: string;
  resetSorting?: boolean;
  replace?: boolean;
}

export type SortFunction = (sortFunctionOptions: ISortFunctionOptions) => void;

interface ISortObject {
  getSortParams: (sortAttribute: string) => ThProps['sort'];
  getSortGroupParams: (sortAttribute: string) => ISortGroupProps['sort'];
}

export interface IDefaultSorting {
  attribute: string;
  direction?: ISortBy['direction'];
}

/**
 * Hook managing sorting functionality for list components like {@link ProjectsList}.
 * - UI changes are propagated to the URL
 * - URL changes are propagated to the UI
 * - Automatic initialization: sorting parameters are automatically added when page is loaded
 *
 * @param sortAttributes - Sort attributes including basic configuration
 * @param componentId - Component ID
 * @param defaultSorting - Default sorting parameters
 */
export const useSorting = (
  sortAttributes: ISortAttributes,
  componentId: string,
  { attribute: defaultSortAttribute, direction: defaultSortDirection = 'asc' }: IDefaultSorting = { attribute: '' }
): ISortObject => {
  /**
   * Check sort options validity. In the future this could be replaced by unified solution covering filtering and sorting.
   *
   * TODO: sortOptionChecker can be removed after NCL-7612 is done
   */
  const sortOptionChecker = () => {
    const sortAttributesArray = Object.entries(sortAttributes);

    sortAttributesArray.forEach(([k, v]) => {
      if (k !== v.id) {
        // #log
        throw new Error(`sortAttributes have invalid format, object key (${k}) has to match id field (${v.id})!`);
      }
    });
  };

  sortOptionChecker();

  const location = useLocation();
  const navigate = useNavigate();

  const [activeSortIndex, setActiveSortIndex] = useState<number>();
  const [activeSortAttribute, setActiveSortAttribute] = useState<string>();
  const [activeSortDirection, setActiveSortDirection] = useState<ISortBy['direction']>(undefined);

  const sort = useCallback(
    ({ sortAttribute, sortDirection, resetSorting = false, replace = false }: ISortFunctionOptions) => {
      // UI -> URL
      updateQueryParamsInURL(
        {
          sort: resetSorting
            ? 'none'
            : `=${sortDirection ? sortDirection : defaultSortDirection}=${sortAttribute ? sortAttribute : defaultSortAttribute}`,
          pageIndex: 1,
        },
        componentId,
        location,
        navigate,
        replace
      );
    },
    [componentId, location, navigate, defaultSortAttribute, defaultSortDirection]
  );

  const getSortParams = (sortAttribute: string): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event, _index, sortDirection) => {
      sort({
        sortAttribute,
        sortDirection,
        /*  Assuming asc as default direction, when previous sort direction was desc and new sorting is 
        applied on the same attribute, then reset sorting */
        resetSorting: activeSortDirection === 'desc' && activeSortAttribute === sortAttribute,
      });
    },
    columnIndex: sortAttributes[sortAttribute].tableColumnIndex,
  });

  const getSortGroupParams = (sortAttribute: string): ISortGroupProps['sort'] => ({
    sortAttributes: sortAttributes,
    sortGroup: sortAttributes[sortAttribute].sortGroup!,
    sort: sort,
    activeSortAttribute: activeSortAttribute,
    activeSortDirection: activeSortDirection,
  });

  useEffect(() => {
    // URL -> UI
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam && validateSortParam(currentSortParam, sortAttributes)) {
      if (currentSortParam === 'none') {
        setActiveSortDirection(undefined);
        setActiveSortAttribute(undefined);
        setActiveSortIndex(undefined);
      } else {
        const currentSortParamSplitted = currentSortParam.split('=');
        currentSortParamSplitted.shift(); // remove empty string

        const [urlSortDirection, urlSortAttribute] = currentSortParamSplitted;
        setActiveSortDirection(urlSortDirection as ISortBy['direction']);
        setActiveSortAttribute(urlSortAttribute);
        setActiveSortIndex(sortAttributes[urlSortAttribute].tableColumnIndex);
      }
    } else {
      if (defaultSortAttribute) {
        // apply default sorting
        sort({ sortAttribute: defaultSortAttribute, sortDirection: defaultSortDirection, replace: true });
      } else {
        // reset sorting
        sort({ resetSorting: true, replace: true });
      }
    }
  }, [location, componentId, sortAttributes, defaultSortAttribute, defaultSortDirection, sort]);

  return { getSortParams, getSortGroupParams };
};
