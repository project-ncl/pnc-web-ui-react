import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ISortOptions, SORT_ORDER } from '../components/Sorting/Sorting';

import { getComponentQueryParamValue, updateQueryParamsInURL } from '../utils/queryParamsHelper';
import { validateSortParam } from '../utils/sortParamHelper';

export const useSorting = (sortOptions: ISortOptions, componentId: string) => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultAttributeKey = Object.entries(sortOptions).find(([_, v]) => v.isDefault)?.[0] || '';
  const defaultSortOrder = sortOptions[defaultAttributeKey]?.defaultSortOrder || SORT_ORDER.Asc;

  /**
   * Add sort param by updating URL.
   */
  const addSortFilter = useCallback(
    (sortAttributeKey: string, order: SORT_ORDER, replace: boolean = false) => {
      updateQueryParamsInURL({ sort: `=${order}=${sortAttributeKey}`, pageIndex: 1 }, componentId, location, navigate, replace);
    },
    [componentId, location, navigate]
  );

  /**
   * Set sort param in URL to 'none'.
   *
   * When request is send to server, and sort param equals to 'none', it is deleted from request.
   */
  const resetSortFilter = useCallback(
    (replace: boolean = false) => {
      updateQueryParamsInURL({ sort: 'none', pageIndex: 1 }, componentId, location, navigate, replace);
    },
    [componentId, location, navigate]
  );

  useEffect(() => {
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    // if URL does not contain valid sort param
    if (!currentSortParam || !validateSortParam(currentSortParam, sortOptions)) {
      // if default sorting is available, use it, otherwise set it to 'none'
      if (defaultAttributeKey) {
        addSortFilter(defaultAttributeKey, defaultSortOrder, true);
      } else {
        resetSortFilter(true);
      }
    }
  }, [location.search, componentId, sortOptions, defaultAttributeKey, defaultSortOrder, addSortFilter, resetSortFilter]);

  /**
   * Check sort options validity.
   */
  useEffect(() => {
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
        console.error('sortOptions: ', sortOptions);
        throw new Error(`sortOptions have invalid format, object key (${k}) has to match id field (${v.id})!`);
      }
    });
  }, [sortOptions]);

  return { addSortFilter, resetSortFilter };
};
