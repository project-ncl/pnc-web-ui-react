import { Button, Chip, ChipGroup, InputGroup, Select, SelectOption, SelectVariant, TextInput } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { constructCustomFilterParam } from '../../utils/customParamHelper';
import { addQParamItem, IQParamOperators, parseQParamDeep, removeQParamItem } from '../../utils/qParamHelper';
import { getComponentQueryParamValue, updateQueryParamsInURL } from '../../utils/queryParamsHelper';
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

/**
 * Not all possible combinations are valid.
 *
 * @example
 * {
 *   id: 'name',
 *   title: 'Name',
 *   placeholder: 'string | !string | s?ring | st*ng',
 *   operator: '=like='
 * }
 *
 * @example
 * {
 *   id: 'status',
 *   title: 'Status',
 *   filterValues: ['SUCCESS', 'REJECTED', 'FAILED'],
 *   operator: '=='
 * }
 *
 * @example
 * {
 *   id: 'customParam',
 *   title: 'Custom Param',
 *   isCustomParam: true,
 *   operator: '=like='
 * }
 */
export interface IFilterAttribute {
  /**
   * ID has to match object key {@link IFilterObject}, there is automatic checker throwing errors if they don't match.
   */
  id: string;
  /**
   * Title will be displayed to the user.
   */
  title: string;
  /**
   * Placeholder when text input is displayed.
   */
  placeholder?: string;
  /**
   * Select instead of text input will be displayed.
   */
  filterValues?: string[];
  /**
   * Additional operators (see IQParamOperators):
   *  - '=like=' valid only when filterValues are not defined ('=notlike=' is determined automatically when filter value starts with ! character)
   *  - '==' valid only when filterValues are defined
   *  - '!=' valid only when filterValues are defined
   */
  operator: IQParamOperators;
  /**
   * When true, custom id based Query Param (not Q) will be used.
   */
  isCustomParam?: boolean;
}

/**
 * @example
 * {
 *   name: {IFilterAttribute},
 *   status: {IFilterAttribute},
 *   customParam: {IFilterAttribute}
 * }
 */
interface IFilterObject {
  [key: string]: IFilterAttribute;
}

export interface IFilterOptions {
  filterAttributes: IFilterObject;
}

interface IFilteringProps {
  filterOptions: IFilterOptions;
  componentId: string;
}

/**
 * @example
  const filterOptions: IFilterOptions = {
    filterAttributes: {
      name: {
        id: 'name',
        title: 'Name',
        placeholder: 'string | !string | s?ring | st*ng',
        operator: '=like=',
      },
      description: {
        id: 'description',
        title: 'Description',
        operator: '=like=',
      },
      customb: {
        id: 'customb',
        title: 'Custom Param',
        isCustomParam: true,
        operator: '=like=',
      },
      status: {
        id: 'status',
        title: 'Status',
        filterValues: ['SUCCESS', 'REJECTED', 'FAILED'],
        operator: '==',
      },
    },
  };
 */
export const Filtering = ({ filterOptions, componentId }: IFilteringProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * FILTER ATTRIBUTE
   */

  // first key
  const defaultAttributeKey = Object.keys(filterOptions.filterAttributes)[0];

  const [filterAttribute, setFilterAttribute] = useState<IFilterAttribute>(filterOptions.filterAttributes[defaultAttributeKey]);
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
  const generateChipTitle = (filterAttribute: IFilterAttribute, filterValue: string): string => {
    if (filterAttribute.operator === '=like=') {
      let isNegated = false;

      // !"%abc%" -> "%abc%" when negated
      if (filterValue.startsWith('!')) {
        filterValue = filterValue.substring(1);
        isNegated = true;
      }

      // %ab_c% -> ab?c (custom param is not wrapped by " characters)
      if (filterAttribute.isCustomParam) {
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
  const addFilter = (filterAttribute: IFilterAttribute, filterValue: string) => {
    // custom query param (not Q param)
    if (filterAttribute.isCustomParam) {
      const adjustedFilterValue = constructCustomFilterParam(filterAttribute, filterValue);
      updateQueryParamsInURL({ [filterAttribute.id]: adjustedFilterValue }, componentId, location, navigate);
    }

    // Q param
    else {
      const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
      const q = addQParamItem(filterAttribute.id, filterValue, filterAttribute.operator, currentQParam);

      /**
       * Update Query Params only if some new meaningful q param is returned.
       */
      if (q) {
        // update Q param and reset pageIndex
        updateQueryParamsInURL({ q, pageIndex: 1 }, componentId, location, navigate);
      }
    }
  };

  /**
   * Remove filter by updating URL.
   */
  const removeFilter = (filterAttributeKey: string, filterValue: string) => {
    if (filterOptions.filterAttributes[filterAttributeKey].isCustomParam) {
      updateQueryParamsInURL({ [filterAttributeKey]: '' }, componentId, location, navigate);
    } else {
      const currentQParam = getComponentQueryParamValue(location.search, 'q', componentId) || '';
      const q = removeQParamItem(
        filterAttributeKey,
        filterValue,
        filterOptions.filterAttributes[filterAttributeKey].operator,
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
      if (value.isCustomParam) {
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

    for (const [key, value] of Object.entries(filterOptions.filterAttributes)) {
      // check filter attributes validity
      if (key !== value.id) {
        console.error('filterAttributes: ', filterOptions.filterAttributes);
        throw new Error(`filterAttributes have invalid format, object key (${key}) has to match id field (${value.id})!`);
      }

      if (value.isCustomParam) {
        const customParamValue = getComponentQueryParamValue(location.search, key, componentId);
        if (customParamValue) {
          appliedFilters[key] = [customParamValue];
        }
      }
    }

    setAppliedFilters(appliedFilters);
  }, [location.search, location, componentId, navigate, filterOptions.filterAttributes]); // primary: history.location.search

  return (
    <>
      {/* FILTER INPUTS */}
      <InputGroup>
        {/* filter attribute */}
        <Select
          width="170px"
          variant={SelectVariant.single}
          onToggle={(isOpen) => {
            setIsFilterAttributeOpen(isOpen);
          }}
          onSelect={(event, selection, isPlaceholder) => {
            if (!isPlaceholder) {
              setFilterAttribute(selection as IFilterAttribute);
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
        {filterAttribute.filterValues?.length ? (
          <Select
            className={styles['form-input']}
            variant={SelectVariant.single}
            onToggle={(isOpen) => {
              setIsFilterValueOpen(isOpen);
            }}
            onSelect={(event, selection, isPlaceholder) => {
              addFilter(filterAttribute, selection as string);
              setIsFilterValueOpen(false);
            }}
            isOpen={isFilterValueOpen}
          >
            {filterAttribute.filterValues.map((filterValue: string) => {
              return <SelectOption key={filterValue} value={filterValue} />;
            })}
          </Select>
        ) : (
          <TextInput
            className={styles['form-input']}
            type="text"
            id="filter-text"
            placeholder={filterAttribute.placeholder || `Filter by ${filterAttribute}`}
            onChange={(value) => {
              setFilterValue(value);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && filterValue && filterValue.trim().length > 0) {
                addFilter(filterAttribute, filterValue);
              }
            }}
          />
        )}
      </InputGroup>

      {/* APPLIED FILTERS */}
      <div className={styles['applied-filters']}>
        {appliedFilters && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};
