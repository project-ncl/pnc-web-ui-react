import { Button, InputGroup, InputGroupItem, Label, LabelGroup, TextInput } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { FILTERING_PLACEHOLDER_DEFAULT } from 'common/constants';
import { IEntityAttribute } from 'common/entityAttributes';
import { WithRequiredProperty } from 'common/types';

import { Select } from 'components/Select/Select';
import { SelectOption } from 'components/Select/SelectOption';

import { constructCustomFilterParam } from 'utils/customParamHelper';
import { TQParamLogicalOperator, addQParamItem, parseQParamDeep, removeQParamItem } from 'utils/qParamHelper';
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
  [key: string]: { logicalOperator: TQParamLogicalOperator; values: string[] };
}

export type TFilterAttribute = WithRequiredProperty<IEntityAttribute, 'filter'>;

export interface IFilterAttributes {
  [key: string]: TFilterAttribute;
}

export interface IDefaultFiltering {
  attribute: string;
}
export interface IFilterOptions {
  filterAttributes: IFilterAttributes;
  defaultFiltering?: IDefaultFiltering;
  customColumns?: string[];
}

interface IFilteringProps {
  filterOptions: IFilterOptions;
  componentId: string;
  onFilter?: (filterAttribute: TFilterAttribute, filterValue: string) => void;
}

export const Filtering = ({ filterOptions, componentId, onFilter }: IFilteringProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * FILTER ATTRIBUTE
   */

  // custom default filter otherwise first attribute
  const defaultAttributeKey = filterOptions.defaultFiltering
    ? filterOptions.defaultFiltering.attribute
    : Object.keys(filterOptions.filterAttributes)[0];

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

      // 'ab\"c\"d' -> 'ab"c"d'
      filterValue = filterValue.replaceAll('\\"', '"');

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
      const q = addQParamItem(
        filterAttribute.id,
        filterValue,
        filterAttribute.filter.operator,
        currentQParam,
        filterAttribute.filter.isToggleable
      );

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
          appliedFilters[k].values = [customParamValue];
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
        <InputGroupItem>
          <div className={styles['filter-attribute-select']}>
            <Select
              isOpen={isFilterAttributeOpen}
              onToggle={setIsFilterAttributeOpen}
              value={filterAttribute}
              onChange={(_, selection) => {
                setFilterValue('');
                setFilterAttribute(selection);
              }}
              isToggleFullWidth={false}
            >
              {Object.keys(filterOptions.filterAttributes).map((filterAttributeKey: string) => {
                const filterAttribute = filterOptions.filterAttributes[filterAttributeKey];
                // use 'title' attribute as default
                filterAttribute.toString = () => {
                  return filterAttribute.title;
                };

                return <SelectOption key={filterAttribute.id} option={filterAttribute} />;
              })}
            </Select>
          </div>
        </InputGroupItem>

        <InputGroupItem>
          {/* filter value */}
          {filterAttribute.values?.length ? (
            <div className={styles['form-input']}>
              <Select
                isOpen={isFilterValueOpen}
                onToggle={setIsFilterValueOpen}
                value={filterValue}
                onChange={(_, selection) => {
                  setFilterValue(selection.toString());
                  addFilter(filterAttribute, selection as string);
                }}
                placeholder="Filter by option"
                isToggleFullWidth={false}
              >
                {filterAttribute.values.map((filterValue: string) => {
                  return <SelectOption key={filterValue} option={filterValue} />;
                })}
              </Select>
            </div>
          ) : (
            <TextInput
              className={styles['form-input']}
              type="text"
              id="filter-text"
              value={filterValue}
              placeholder={filterAttribute.filter.placeholder || FILTERING_PLACEHOLDER_DEFAULT}
              onChange={(_, value) => {
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
        </InputGroupItem>
      </InputGroup>

      {/* APPLIED FILTERS */}
      {/* using > 0 is necessary otherwise 0 (falsy expression) would be explicitly printed, see https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator */}
      {appliedFilters && Object.keys(appliedFilters).length > 0 && (
        <div className={styles['applied-filters']}>
          {/* FILTER CHIPS */}
          {Object.keys(appliedFilters).map((filterAttributeKey) => (
            <LabelGroup
              className={styles['chip-group']}
              key={filterAttributeKey}
              categoryName={filterOptions.filterAttributes[filterAttributeKey].title}
            >
              {appliedFilters[filterAttributeKey].values.map((filterValueItem, i) => (
                <span key={filterValueItem}>
                  <Label
                    variant="outline"
                    onClose={() => {
                      removeFilter(filterAttributeKey, filterValueItem);
                    }}
                  >
                    {generateChipTitle(filterOptions.filterAttributes[filterAttributeKey], filterValueItem)}
                  </Label>
                  {i + 1 !== appliedFilters[filterAttributeKey].values.length && (
                    <span className={css('p-l-5', styles['chip-group-separator'])}>
                      {appliedFilters[filterAttributeKey].logicalOperator}
                    </span>
                  )}
                </span>
              ))}
            </LabelGroup>
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
