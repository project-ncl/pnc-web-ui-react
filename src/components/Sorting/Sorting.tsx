import { Button, InputGroup, Select, SelectOption, SelectVariant, Tooltip } from '@patternfly/react-core';
import { SortAmountDownAltIcon, SortAmountDownIcon, TimesIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useSorting } from 'containers/useSorting';

import { getComponentQueryParamValue } from 'utils/queryParamsHelper';

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
  sorting: ReturnType<typeof useSorting>;
}

/**
 * Component allowing to sort lists.
 * Sorting options: asc, desc, none.
 * sortOptions are used to choose which attributes will be sortable.
 * One attribute can be sorted by default. Also default sorting order of default attribute can be specified.
 *
 * @param sortOptions - options / settings of sorting
 * @param componentId - url id of component
 * @param sorting     - object returned by useSorting hook
 */
export const Sorting = ({ sortOptions, componentId, sorting }: ISortingProps) => {
  const location = useLocation();

  // attribute by which list is sorted
  const [sortAttribute, setSortAttribute] = useState<ISortAttribute>();
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.Asc);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState<boolean>(false);

  // const { addSortFilter, resetSortFilter } = useSorting(componentId);

  /**
   * Synchronize UI with the URL sort param.
   */
  useEffect(() => {
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam) {
      if (currentSortParam === 'none') {
        setSortAttribute(undefined);
      } else {
        const currentSortParamSplitted = currentSortParam.split('=');
        currentSortParamSplitted.shift(); // remove empty string

        const [urlSortOrder, urlSortAttributeKey] = currentSortParamSplitted;
        setSortOrder(urlSortOrder as SORT_ORDER);
        setSortAttribute(sortOptions[urlSortAttributeKey]);
      }
    }
  }, [location.search, componentId, sortOptions]);

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
          sorting.addSortFilter((selection as ISortAttribute)?.id, sortOrder);
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
            sorting.addSortFilter(sortAttribute!.id, sortOrder === SORT_ORDER.Asc ? SORT_ORDER.Desc : SORT_ORDER.Asc);
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
              sorting.resetSortFilter();
            }}
          />
        </Tooltip>
      )}
    </InputGroup>
  );
};
