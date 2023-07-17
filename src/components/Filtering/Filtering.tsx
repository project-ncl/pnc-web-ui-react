import { Button, Chip, ChipGroup, InputGroup, Select, SelectOption, SelectVariant, TextInput } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FILTERING_PLACEHOLDER_DEFAULT } from 'common/constants';
import { IEntityAttribute } from 'common/entityAttributes';
import { WithRequiredProperty } from 'common/types';

import { constructCustomFilterParam } from 'utils/customParamHelper';
import { addQParamItem, parseQParamDeep, removeQParamItem } from 'utils/qParamHelper';
import { getComponentQueryParamValue, updateQueryParamsInURL } from 'utils/queryParamsHelper';

import styles from './Filtering.module.css';

/**
 * All Query params except:
 *  - pagination
 *  - sorting
 *
 * Typically Q params and other custom params.
 *
 * @example
 * {
 *   status: ['REJECTED', 'FAILED']
 *   buildConfigName: ['%customA%']
 * }
 */
export interface IAppliedFilters {
  [key: string]: string[];
}

export type TFilterAttribute = WithRequiredProperty<IEntityAttribute, 'filter'>;

export interface IFilterAttributes {
  [key: string]: TFilterAttribute;
}

export interface IFilterOptions {
  filterAttributes: IFilterAttributes;
  customKeys?: string[] | null;
}

export interface IDefaultFiltering {
  attribute: string;
}

interface IFilteringProps {
  filterOptions: IFilterOptions;
  componentId: string;
  defaultFiltering?: IDefaultFiltering;
  onFilter?: (filterAttribute: TFilterAttribute, filterValue: string) => void;
}

export const Filtering = ({ filterOptions, componentId, defaultFiltering, onFilter }: IFilteringProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * FILTER ATTRIBUTE
   */

  // custom default filter otherwise first attribute
  const defaultAttributeKey = defaultFiltering ? defaultFiltering.attribute : Object.keys(filterOptions.filterAttributes)[0];

  const [filterAttribute, setFilterAttribute] = useState<TFilterAttribute>(filterOptions.filterAttributes[defaultAttributeKey]);
  const [isFilterAttributeOpen, setIsFilterAttributeOpen] = useState<boolean>(false);

  /**
   * FILTER VALUE
   */
  const [filterValue, setFilterValue] = useState<string>('');
  const [isFilterValueOpen, setIsFilterValueOpen] = useState<boolean>(false);

  /**
   * APPLIED FILTERS
   */
  const [appliedFilters, setAppliedFilters] = useState<IAppliedFilters>();

  /**
   * Generate user friendly chip title representing applied filter (Q param or custom filter param).
   */
  const generateChipTitle = (filterAttribute: TFilterAttribute, filterValue: string): string => {
    if (filterAttribute.filter.operator === '=like=') {
      let isNegated = false;

      // !"%abc%" -> "%abc%" when negated
      if (filterValue.startsWith('!')) {
        filterValue = filterValue.substring(1);
        isNegated = true;
      }

      // %abc% -> abc (custom param is not wrapped by " characters)
      if (filterAttribute.filter.isCustomParam) {
        filterValue = filterValue.substring(1, filterValue.length - 1);
      }
      // "%abc%" -> abc
      else {
        filterValue = filterValue.substring(2, filterValue.length - 2);
      }

      // abc -> !abc when negated
      return (isNegated ? '!' : '') + filterValue;
    }
    return filterValue;
  };

  /**
   * Add filter by updating URL.
   */
  const addFilter = (filterAttribute: TFilterAttribute, filterValue: string) => {
    // custom query param (not Q param)
    if (filterAttribute.filter.isCustomParam) {
      const adjustedFilterValue = constructCustomFilterParam(filterAttribute, filterValue);
      updateQueryParamsInURL({ [filterAttribute.id]: adjustedFilterValue }, componentId, location, navigate);
    }

    // Q param
    else {
      const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
      const q = addQParamItem(filterAttribute.id, filterValue, filterAttribute.filter.operator, currentQParam);

      /**
       * Update Query Params only if some new meaningful q param is returned.
       */
      if (q) {
        // update Q param and reset pageIndex
        updateQueryParamsInURL({ q, pageIndex: 1 }, componentId, location, navigate);
      }
    }

    if (onFilter) {
      onFilter(filterAttribute, filterValue);
    }
  };

  /**
   * Remove filter by updating URL.
   */
  const removeFilter = (filterAttributeKey: string, filterValue: string) => {
    if (filterOptions.filterAttributes[filterAttributeKey].filter.isCustomParam) {
      updateQueryParamsInURL({ [filterAttributeKey]: '' }, componentId, location, navigate);
    } else {
      const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
      const q = removeQParamItem(
        filterAttributeKey,
        filterValue,
        filterOptions.filterAttributes[filterAttributeKey].filter.operator,
        currentQParam
      );
      updateQueryParamsInURL({ q }, componentId, location, navigate);
    }
  };

  /**
   * Reset all filtering parameters to empty '' string and update Query Params in URL, they will be removed if empty.
   *
   * Non filtering parameters (like pagination and sorting) are untouched.
   */
  const removeAllFilters = () => {
    // reset q parameter
    const zeroedFilteringParameters: { [key: string]: string } = { q: '' };

    // reset all custom filtering parameters
    for (const [key, value] of Object.entries(filterOptions.filterAttributes)) {
      if (value.filter.isCustomParam) {
        zeroedFilteringParameters[key] = '';
      }
    }

    updateQueryParamsInURL(zeroedFilteringParameters, componentId, location, navigate);
  };

  /**
   * Synchronize filters from URL to appliedFilters react hook.
   */
  useEffect(() => {
    const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
    const appliedFilters: IAppliedFilters = parseQParamDeep(currentQParam);

    Object.entries(filterOptions.filterAttributes).forEach(([k, v]) => {
      if (v.filter.isCustomParam) {
        const customParamValue = getComponentQueryParamValue(location.search, k, componentId);
        if (customParamValue) {
          appliedFilters[k] = [customParamValue];
        }
      }
    });

    setAppliedFilters(appliedFilters);
  }, [location.search, location, componentId, navigate, filterOptions.filterAttributes]); // primary: history.location.search

  return (
    <>
      {/* FILTER INPUTS */}
      <InputGroup>
        {/* filter attribute */}
        <Select
          width="200px"
          variant={SelectVariant.single}
          onToggle={(isOpen) => {
            setIsFilterAttributeOpen(isOpen);
          }}
          onSelect={(event, selection, isPlaceholder) => {
            setFilterValue('');
            if (!isPlaceholder) {
              setFilterAttribute(selection as TFilterAttribute);
              setIsFilterAttributeOpen(false);
            }
          }}
          selections={filterAttribute}
          isOpen={isFilterAttributeOpen}
        >
          {Object.keys(filterOptions.filterAttributes).map((filterAttributeKey: string) => {
            const filterAttribute = filterOptions.filterAttributes[filterAttributeKey];
            // use 'title' attribute as default
            filterAttribute.toString = () => {
              return filterAttribute.title;
            };

            return <SelectOption key={filterAttribute.id} value={filterAttribute} />;
          })}
        </Select>

        {/* filter value */}
        {filterAttribute.values?.length ? (
          <Select
            className={styles['form-input']}
            variant={SelectVariant.single}
            hasPlaceholderStyle
            placeholderText="Filter by option"
            onToggle={(isOpen) => {
              setIsFilterValueOpen(isOpen);
            }}
            onSelect={(event, selection, isPlaceholder) => {
              addFilter(filterAttribute, selection as string);
              setIsFilterValueOpen(false);
            }}
            isOpen={isFilterValueOpen}
          >
            {filterAttribute.values.map((filterValue: string) => {
              return <SelectOption key={filterValue} value={filterValue} />;
            })}
          </Select>
        ) : (
          <TextInput
            className={styles['form-input']}
            type="text"
            id="filter-text"
            value={filterValue}
            placeholder={filterAttribute.filter.placeholder || FILTERING_PLACEHOLDER_DEFAULT}
            onChange={(value) => {
              setFilterValue(value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filterValue && filterValue.trim().length > 0) {
                addFilter(filterAttribute, filterValue);
                setFilterValue('');
              }
            }}
          />
        )}
      </InputGroup>

      {/* APPLIED FILTERS */}
      {/* using > 0 is necessary otherwise 0 (falsy expression) would be explicitly printed, see https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator */}
      {appliedFilters && Object.keys(appliedFilters).length > 0 && (
        <div className={styles['applied-filters']}>
          {/* FILTER CHIPS */}
          {Object.keys(appliedFilters).map((filterAttributeKey) => (
            <ChipGroup
              className={styles['chip-group']}
              key={filterAttributeKey}
              categoryName={filterOptions.filterAttributes[filterAttributeKey].title}
            >
              {appliedFilters[filterAttributeKey].map((filterValueItem) => (
                <Chip
                  key={filterValueItem}
                  onClick={() => {
                    removeFilter(filterAttributeKey, filterValueItem);
                  }}
                >
                  {generateChipTitle(filterOptions.filterAttributes[filterAttributeKey], filterValueItem)}
                </Chip>
              ))}
            </ChipGroup>
          ))}

          {/* CLEAR ALL */}
          {Object.keys(appliedFilters).length !== 0 && (
            <Button
              onClick={() => {
                removeAllFilters();
              }}
              variant="link"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </>
  );
};
