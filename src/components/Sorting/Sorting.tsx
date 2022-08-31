import { Button, InputGroup, Select, SelectOption, SelectVariant, Tooltip } from '@patternfly/react-core';
import { SortAmountDownAltIcon, SortAmountDownIcon, TimesIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';
import { validateSortParam } from 'utils/sortParamHelper';

import '../../index.css';

export enum SORT_ORDER {
  Asc = 'asc',
  Desc = 'desc',
}

/**
 * @example
 * {
 *   id: 'name',
 *   title: 'Name'
 * }
 *
 * @example
 * {
 *   id: 'description',
 *   title: 'Description',
 *   isDefault: true
 * }
 *
 * @example
 * {
 *   id: 'description',
 *   title: 'Description',
 *   isDefault: true,
 *   defaultSortOrder: SORT_ODER.Desc
 * }
 */
interface ISortAttribute {
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
  defaultSortOrder?: SORT_ORDER;
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

interface ISortingProps {
  sortOptions: ISortOptions;
  componentId: string;
}

/**
 * Component allowing to sort lists.
 * Sorting options: asc, desc, none.
 * sortOptions are used to choose which attributes will be sortable.
 * One attribute can be sorted by default. Also default sorting order of default attribute can be specified.
 *
 * @param sortOptions - options / settings of sorting
 * @param componentId - url id of component
 */
export const Sorting = ({ sortOptions, componentId }: ISortingProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultAttributeKey = Object.entries(sortOptions).find(([_, v]) => v.isDefault)?.[0] || '';
  const defaultSortOrder = sortOptions[defaultAttributeKey]?.defaultSortOrder || SORT_ORDER.Asc;

  // attribute by which list is sorted
  const [sortAttribute, setSortAttribute] = useState<ISortAttribute>();
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.Asc);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState<boolean>(false);

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

  /**
   * Synchronize UI with the URL sort param.
   */
  useEffect(() => {
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    // if URL contains valid sort param
    if (currentSortParam && validateSortParam(currentSortParam, sortOptions)) {
      if (currentSortParam === 'none') {
        setSortAttribute(undefined);
      } else {
        const currentSortParamSplitted = currentSortParam.split('=');
        currentSortParamSplitted.shift(); // remove empty string

        const [urlSortOrder, urlSortAttributeKey] = currentSortParamSplitted;
        setSortOrder(urlSortOrder as SORT_ORDER);
        setSortAttribute(sortOptions[urlSortAttributeKey]);
      }
    } else {
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

  return (
    <InputGroup>
      <Select
        className="p-l-10 p-r-10"
        variant={SelectVariant.single}
        placeholderText="Sort"
        hasPlaceholderStyle
        onToggle={(isOpen) => {
          setIsSortSelectOpen(isOpen);
        }}
        onSelect={(_, selection) => {
          setIsSortSelectOpen(false);
          addSortFilter((selection as ISortAttribute)?.id, sortOrder);
        }}
        selections={sortAttribute}
        isOpen={isSortSelectOpen}
      >
        {[
          ...Object.keys(sortOptions).map((sortAttributeKey: string) => {
            const sortAttribute = sortOptions[sortAttributeKey];
            // use 'title' attribute as default
            sortAttribute.toString = () => sortAttribute.title;

            return <SelectOption key={sortAttribute.id} value={sortAttribute} />;
          }),
        ]}
      </Select>

      <Tooltip content={sortOrder === SORT_ORDER.Asc ? 'Asc' : 'Desc'}>
        <Button
          className="p-l-10 p-r-10"
          variant="plain"
          isDisabled={!sortAttribute}
          onClick={() => {
            addSortFilter(sortAttribute!.id, sortOrder === SORT_ORDER.Asc ? SORT_ORDER.Desc : SORT_ORDER.Asc);
          }}
          icon={sortOrder === SORT_ORDER.Asc ? <SortAmountDownAltIcon /> : <SortAmountDownIcon />}
        />
      </Tooltip>

      {sortAttribute && (
        <Tooltip content="Remove sorting">
          <Button
            className="p-l-10 p-r-10"
            variant="plain"
            icon={<TimesIcon />}
            onClick={() => {
              resetSortFilter();
            }}
          />
        </Tooltip>
      )}
    </InputGroup>
  );
};
