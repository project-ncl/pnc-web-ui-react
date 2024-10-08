import { Spinner } from '@patternfly/react-core';
import { Select, SelectOption, SelectOptionObject, SelectProps, SelectVariant } from '@patternfly/react-core/deprecated';
import { css } from '@patternfly/react-styles';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { FILTERING_PLACEHOLDER_DEFAULT } from 'common/constants';

import { IRegisterData } from 'hooks/useForm';
import { IServiceDataPaginated, areServiceDataPaginated, useServiceContainer } from 'hooks/useServiceContainer';

import '../../index.css';
import styles from './SearchSelect.module.css';

type FetchCallbackFunction = (requstConfig?: AxiosRequestConfig) => Promise<AxiosResponse<any, any> | any>;
type OnSelectFunction = (event: FormEvent | undefined, selection: string | SelectOptionObject, selectedEntity?: any) => void;
type OnClearFunction = (event: FormEvent | undefined) => void;

interface ISearchSelectProps {
  selectedItem?: string;
  validated?: IRegisterData<any>['validated'];
  onSelect?: OnSelectFunction;
  onClear?: OnClearFunction;
  fetchCallback: FetchCallbackFunction;
  titleAttribute: string;
  descriptionAttribute?: string;
  getCustomDescription?: (optionEntity: any) => ReactNode;
  delayMilliseconds?: number;
  pageSizeDefault?: number;
  width?: SelectProps['width'];
  placeholderText?: SelectProps['placeholderText'];
  isDisabled?: SelectProps['isDisabled'];
}

/**
 * Filtered select with data dynamically fetched from backend.
 * Select options data are fetched:
 *  -> when select is firstly loaded
 *  -> when filter input text is changed (by typing or selecting an option)
 *
 * Filtering is done by titleAttribute equality to current filter text value (=like= operator).
 * If descriptionAttribute is defined, descriptionAttribute equality to current filter operation is also appended
 * by OR operator.
 *
 * onSelect callback is used so selected option is accessible from outside.
 *
 * @param selectedItem - selectected item string
 * @param validated - input validation state
 * @param onSelect - onSelect callback
 * @param onClear - onClear callback
 * @param fetchCallback - function to fetch the data from backend
 * @param titleAttribute - primary attribute to filter by (in query params), displayed as option name
 * @param descriptionAttribute - secondary attribute to filter by (in query params), displayed as option description (if getCustomDescription is undefined)
 * @param getCustomDescription - callback to construct the option description based on the option entity
 * @param delayMilliseconds - fetch delay for filter input change
 * @param pageSizeDefault - count of entries fetched defaultly
 * @param width - select width
 * @param placeholderText - select placeholder
 * @param isDisabled - whether is select disabled
 */
export const SearchSelect = ({
  selectedItem,
  validated,
  onSelect,
  onClear,
  fetchCallback,
  titleAttribute,
  descriptionAttribute,
  getCustomDescription,
  delayMilliseconds = 200,
  pageSizeDefault = 10,
  width,
  placeholderText = FILTERING_PLACEHOLDER_DEFAULT,
  isDisabled,
}: ISearchSelectProps) => {
  // data downloaded using fetchCallback
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const pageIndexDefault = 1;
  // current page index
  const [pageIndex, setPageIndex] = useState<number>(pageIndexDefault);

  const [searchValue, setSearchValue] = useState<string>(selectedItem ? selectedItem : '');
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const selectRef = useRef<Select>(null);

  // used to fetch data after delay
  const timeout = useRef<NodeJS.Timeout>();

  const serviceContainer = useServiceContainer(fetchCallback);
  const serviceContainerRunner = serviceContainer.run;

  // return text of select filter
  const getFilterText = useCallback(() => {
    return selectRef.current?.['inputRef'].current.value || '';
  }, []);

  // fetch data and save them
  const fetchData = useCallback(
    (filterText: string = '', pageIndex: number = pageIndexDefault) => {
      const requestConfig: AxiosRequestConfig = { params: { pageIndex, pageSize: pageSizeDefault } };
      if (filterText) {
        const titleFilter = `${titleAttribute}=like="%${filterText}%"`;
        const descriptionFilter = descriptionAttribute ? `,${descriptionAttribute}=like="%${filterText}%"` : '';

        requestConfig.params.q = `${titleFilter}${descriptionFilter}`;
      }

      setPageIndex(pageIndex);

      serviceContainerRunner({
        requestConfig,
        onSuccess: (result) => {
          const data = (result.response.data as IServiceDataPaginated<Object>)?.content;
          if (pageIndex === pageIndexDefault) {
            setFetchedData(data);
          } else {
            setFetchedData((fetchedData) => [...fetchedData, ...data]);
          }
        },
        onError: () => {
          setPageIndex(pageIndexDefault);
          setFetchedData([]);
        },
      });
    },
    [serviceContainerRunner, titleAttribute, descriptionAttribute, pageSizeDefault]
  );

  // fetch data with same filtering string as currently set
  const refetchData = useCallback(
    (pageIndex: number = pageIndexDefault) => {
      fetchData(getFilterText(), pageIndex);
    },
    [fetchData, getFilterText]
  );

  useEffect(() => {
    fetchData(selectedItem);
    setSearchValue(selectedItem ? selectedItem : '');
  }, [fetchData, selectedItem]);

  // filtering of select
  const filterSelect = (value: string) => {
    if (selectedItem) {
      onClear?.(undefined);
    }

    setSearchValue(value);
    clearTimeout(timeout?.current);
    timeout.current = setTimeout(() => fetchData(value), delayMilliseconds);
  };

  // inner onSelect callback
  const selectItem = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder: boolean | undefined
  ) => {
    if (isPlaceholder) clear(event);
    else {
      if (event) {
        // do this only when select option is clicked
        // (for some reason, this function is called also on blur)

        // set options to an empty array for a while so loading state is visible
        setFetchedData([]);
        onSelect?.(event, selection.toString(), (selection as any).entity);
      }
      setIsSelectOpen(false);
    }
  };

  // inner onClear callback
  const clear = (event: FormEvent) => {
    setIsSelectOpen(false);
    if (selectedItem) {
      // on selection clear
      onClear?.(event);
    } else {
      // on unselected filter text clear
      setSearchValue('');
      fetchData();
    }
  };

  const onViewMoreClick = () => {
    refetchData(pageIndex + 1);
  };

  const getLoadingVariant = (): undefined | SelectProps['loadingVariant'] => {
    if (serviceContainer.loading) return 'spinner';

    // When error, then noResultsFoundText property is used to display error message
    if (serviceContainer.error) return undefined;

    if (
      areServiceDataPaginated(serviceContainer.data) &&
      serviceContainer.data?.totalPages &&
      pageIndex < serviceContainer.data.totalPages
    ) {
      return { text: 'View more', onClick: onViewMoreClick };
    }
  };

  return (
    <div className="position-relative">
      {serviceContainer.loading && serviceContainer.data && (
        <Spinner
          size="md"
          className={css(
            styles['search-select-spinner'],
            getFilterText() && validated && validated !== 'default'
              ? styles['search-select-spinner-filtered-and-validated']
              : getFilterText() || (validated && validated !== 'default')
              ? styles['search-select-spinner-filtered']
              : styles['search-select-spinner-nofilter']
          )}
        />
      )}
      <Select
        ref={selectRef}
        variant={SelectVariant.typeahead}
        selections={searchValue}
        validated={validated}
        onSelect={selectItem}
        onClear={clear}
        onTypeaheadInputChanged={filterSelect}
        onFilter={() => {
          // filtering is not done here
          return undefined;
        }}
        isOpen={isSelectOpen}
        onToggle={(_, isOpen) => {
          setIsSelectOpen(isOpen);
        }}
        width={width}
        placeholderText={placeholderText}
        isDisabled={isDisabled}
        isInputValuePersisted={true}
        isInputFilterPersisted={true}
        noResultsFoundText={serviceContainer.error ? serviceContainer.error : 'No results were found'}
        loadingVariant={getLoadingVariant()}
      >
        {fetchedData?.map((entity: any, index: number) => {
          const description = getCustomDescription
            ? getCustomDescription(entity)
            : descriptionAttribute && entity[descriptionAttribute];

          return (
            <SelectOption
              key={index}
              value={{ entity, toString: () => entity[titleAttribute] } as SelectOptionObject}
              description={description}
            />
          );
        })}
      </Select>
    </div>
  );
};
