import { ISortBy, ThProps } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ISortOptions } from 'components/Sorting/Sorting';

import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';
import { validateSortParam } from 'utils/sortParamHelper';

/**
 * Hook managing sorting functionality for list components like {@link ProjectsList}.
 * - UI changes are propagated to the URL
 * - URL changes are propagated to the UI
 * - Automatic initialization: sorting parameters are automatically added when page is loaded
 *
 * @param sortOptions - Sorting options
 * @param componentId - Component ID
 */
export const useSorting = (sortOptions: ISortOptions, componentId: string) => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultSortAttribute: string = Object.entries(sortOptions).find(([_, v]) => v.isDefault)?.[0] || '';
  const defaultSortDirection: ISortBy['direction'] = sortOptions[defaultSortAttribute]?.defaultSortOrder || 'asc';

  const [activeSortIndex, setActiveSortIndex] = useState<number>();
  const [activeSortDirection, setActiveSortDirection] = useState<ISortBy['direction']>(undefined);

  const getSortParams = (sortAttribute: string): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event, index, sortDirection) => {
      // UI -> URL
      updateQueryParamsInURL(
        { sort: `=${sortDirection}=${sortAttribute}`, pageIndex: 1 },
        componentId,
        location,
        navigate,
        false
      );
    },
    columnIndex: sortOptions[sortAttribute].tableColumnIndex,
  });

  useEffect(() => {
    // URL -> UI
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam && validateSortParam(currentSortParam, sortOptions)) {
      if (currentSortParam === 'none') {
        setActiveSortDirection(undefined);
      } else {
        const currentSortParamSplitted = currentSortParam.split('=');
        currentSortParamSplitted.shift(); // remove empty string

        const [urlSortDirection, urlSortAttribute] = currentSortParamSplitted;
        setActiveSortDirection(urlSortDirection as ISortBy['direction']);
        setActiveSortIndex(sortOptions[urlSortAttribute].tableColumnIndex);
      }
    } else {
      if (defaultSortAttribute) {
        // apply default sorting
        updateQueryParamsInURL(
          { sort: `=${defaultSortDirection}=${defaultSortAttribute}`, pageIndex: 1 },
          componentId,
          location,
          navigate,
          false
        );
      } else {
        // reset sorting
        updateQueryParamsInURL({ sort: `none` }, componentId, location, navigate, false);
      }
    }
  }, [location, componentId, sortOptions, defaultSortAttribute, defaultSortDirection, navigate]);

  return { getSortParams };
};
