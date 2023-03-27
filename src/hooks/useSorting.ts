import { ISortBy, ThProps } from '@patternfly/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
 *   isDefault: true,
 *   tableColumnIndex: 1
 * }
 *
 * @example
 * {
 *   id: 'name',
 *   title: 'Name',
 *   isDefault: true,
 *   defaultSortOrder: 'asc',
 *   tableColumnIndex: 0
 * }
 *
 * @example
 * {
 *   id: 'description',
 *   title: 'Description',
 *   isDefault: true,
 *   defaultSortOrder: 'desc',
 *   tableColumnIndex: 1
 * }
 */
export interface ISortAttribute {
  /**
   * ID has to match object key {@link ISortOptions}, there is automatic checker throwing errors if they don't match.
   */
  id: string;
  /**
   * Sorting option title.
   */
  title: string;
  /**
   * Should be sorted by default by this attribute?
   * Maximally one attribute should be default.
   */
  isDefault?: boolean;
  /**
   * If sorted by default by this attribute, which order is used?
   * If omitted, ascending order is assumed.
   */
  defaultSortOrder?: ISortBy['direction'];
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
  sortingGroup?: string;
}

interface ISortConfig {
  sortAttribute?: string;
  sortDirection?: string;
  resetSorting?: boolean;
  replace?: boolean;
}

/**
 * @example
 * {
 *   name: {ISortAttribute},
 *   description: {ISortAttribute}
 * }
 */
export interface ISortOptions {
  [key: string]: ISortAttribute;
}

export interface ISortObject {
  getSortParams: (sortAttribute: string) => ThProps['sort'];
  sort: (sortConfig: ISortConfig) => void;
  activeSortAttribute: string | undefined;
  activeSortDirection: string | undefined;
}

/**
 * Hook managing sorting functionality for list components like {@link ProjectsList}.
 * - UI changes are propagated to the URL
 * - URL changes are propagated to the UI
 * - Automatic initialization: sorting parameters are automatically added when page is loaded
 *
 * @param sortOptions - Sorting options
 * @param componentId - Component ID
 */
export const useSorting = (sortOptions: ISortOptions, componentId: string): ISortObject => {
  /**
   * Check sort options validity. In the future this could be replaced by unified solution covering filtering and sorting.
   */
  const sortOptionChecker = () => {
    const sortOptionsArray = Object.entries(sortOptions);

    const defaultSortOptionsArray = sortOptionsArray.filter(([_, v]) => v.isDefault);
    if (defaultSortOptionsArray.length > 1) {
      const defaultSortOptionsKeysString = defaultSortOptionsArray.map((arr) => arr[0]).join(', ');
      // #log
      console.warn('Sorting: More than one sorting options were specified:', defaultSortOptionsKeysString);
    }

    sortOptionsArray.forEach(([k, v]) => {
      if (k !== v.id) {
        // #log
        throw new Error(`sortOptions have invalid format, object key (${k}) has to match id field (${v.id})!`);
      }
    });
  };

  sortOptionChecker();

  const location = useLocation();
  const navigate = useNavigate();

  const defaultSortAttribute: string = Object.entries(sortOptions).find(([_, v]) => v.isDefault)?.[0] || '';
  const defaultSortDirection: ISortBy['direction'] = sortOptions[defaultSortAttribute]?.defaultSortOrder || 'asc';

  const [activeSortIndex, setActiveSortIndex] = useState<number>();
  const [activeSortAttribute, setActiveSortAttribute] = useState<string>();
  const [activeSortDirection, setActiveSortDirection] = useState<ISortBy['direction']>(undefined);

  const sort = useCallback(
    ({ sortAttribute, sortDirection, resetSorting = false, replace = false }: ISortConfig) => {
      // UI -> URL
      updateQueryParamsInURL(
        { sort: resetSorting ? 'none' : `=${sortDirection}=${sortAttribute}`, pageIndex: 1 },
        componentId,
        location,
        navigate,
        replace
      );
    },
    [componentId, location, navigate]
  );

  const getSortParams = (sortAttribute: string): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event, _index, sortDirection) => {
      sort({ sortAttribute, sortDirection });
    },
    columnIndex: sortOptions[sortAttribute].tableColumnIndex,
  });

  useEffect(() => {
    // URL -> UI
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam && validateSortParam(currentSortParam, sortOptions)) {
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
        setActiveSortIndex(sortOptions[urlSortAttribute].tableColumnIndex);
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
  }, [location, componentId, sortOptions, defaultSortAttribute, defaultSortDirection, sort]);

  return { getSortParams, sort, activeSortAttribute, activeSortDirection };
};
