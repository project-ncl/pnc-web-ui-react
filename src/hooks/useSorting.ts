import { ISortBy, ThProps } from '@patternfly/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IEntityAttribute } from 'common/entityAttributes';
import { WithRequiredProperty } from 'common/types';

import { ISortGroupProps } from 'components/SortGroup/SortGroup';

import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';
import { validateSortParam } from 'utils/sortParamHelper';

export type TSortAttribute = WithRequiredProperty<IEntityAttribute, 'sort'>;

export interface ISortAttributes {
  [key: string]: TSortAttribute;
}

export interface ISortOptions {
  sortAttributes: ISortAttributes;
  defaultSorting?: IDefaultSorting;
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
 * @param sortOptions - Sort options including basic configuration
 * @param componentId - Component ID
 */
export const useSorting = (sortOptions: ISortOptions, componentId: string): ISortObject => {
  const defaultSortAttribute = sortOptions.defaultSorting?.attribute;
  const defaultSortDirection = sortOptions.defaultSorting?.direction;

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
    columnIndex: sortOptions.sortAttributes[sortAttribute].sort.tableColumnIndex!,
  });

  const getSortGroupParams = (sortAttribute: string): ISortGroupProps['sort'] => ({
    sortAttributes: sortOptions.sortAttributes,
    sortGroup: sortOptions.sortAttributes[sortAttribute].sort.group!,
    sort: sort,
    activeSortAttribute: activeSortAttribute,
    activeSortDirection: activeSortDirection,
  });

  useEffect(() => {
    // URL -> UI
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam && validateSortParam(currentSortParam, sortOptions.sortAttributes)) {
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
        setActiveSortIndex(sortOptions.sortAttributes[urlSortAttribute].sort.tableColumnIndex!);
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
  }, [location, componentId, sortOptions.sortAttributes, defaultSortAttribute, defaultSortDirection, sort]);

  return { getSortParams, getSortGroupParams };
};
