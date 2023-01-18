import { Select, SelectOption, SelectOptionObject, SelectVariant, Spinner } from '@patternfly/react-core';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useServiceContainer } from 'hooks/useServiceContainer';

import '../../index.css';
import styles from './SearchSelect.module.css';

type FetchCallbackFunction = (requstConfig?: AxiosRequestConfig) => Promise<AxiosResponse<any, any>>;
type OnSelectFunction = (value: string | SelectOptionObject) => void;

interface ISearchSelectProps {
  fetchCallback: FetchCallbackFunction;
  titleAttribute: string;
  descriptionAttribute?: string;
  onSelect: OnSelectFunction;
  delayMilliseconds?: number;
  pageSizeDefault?: number;
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
 * @param fetchCallback - function to fetch the data from backend
 * @param titleAttribute - which attribute will be filtered
 * @param descriptionAttribute - which attribute in fetched data is displayed as description (and included in filtering)
 * @param onSelect - function to be called when option is selected (value is passed in)
 * @param delayMilliseconds - delay after which data are fetched when filter input is changed
 * @param pageSizeDefault - count of entries fetched defaultly
 */
export const SearchSelect = ({
  fetchCallback,
  titleAttribute,
  descriptionAttribute,
  onSelect,
  delayMilliseconds = 200,
  pageSizeDefault = 20,
}: ISearchSelectProps) => {
  // filtered data downloaded using callback
  const [currentData, setCurrentData] = useState<any[]>([]);
  const pageIndexDefault = 1;
  // current page index
  const [pageIndex, setPageIndex] = useState<number>(pageIndexDefault);
  // currenyly selected option
  const [selectedItem, setSelectedItem] = useState<string | undefined>();

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
        const descriptionFilter = `${descriptionAttribute}=like="%${filterText}%"`;

        requestConfig.params.q = `${titleFilter}${descriptionAttribute && `,${descriptionFilter}`}`;
      }

      setPageIndex(pageIndex);

      serviceContainerRunner({ requestConfig })
        .then((response: any) => {
          const data = response.data.content;
          if (pageIndex === pageIndexDefault) {
            setCurrentData(data);
          } else {
            setCurrentData((currentData) => [...currentData, ...data]);
          }
        })
        .catch(() => {
          setPageIndex(pageIndexDefault);
          setCurrentData([]);
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

  // load first data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // filtering of select
  const filterSelect = (value: string) => {
    // if text filter changed, unselect
    clearSelectedItem();

    clearTimeout(timeout?.current);
    timeout.current = setTimeout(() => fetchData(value), delayMilliseconds);
  };

  // selecting an option
  const selectItem = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder: boolean | undefined
  ) => {
    if (isPlaceholder) clear();
    else {
      if (event) {
        // do this only when select option is clicked
        // (for some reason, this function is called also on blur)

        // set options to an empty array for a while so loading state is visible
        setCurrentData([]);
        fetchData(selection as string);
        onSelect(selection);
      }
      setSelectedItem(selection as string);
      setIsSelectOpen(false);
    }
  };

  // if anything was selected, unselect it
  const clearSelectedItem = () => {
    if (selectedItem) {
      setSelectedItem(undefined);
      onSelect('');
    }
  };

  // on clear, set empty filter
  const clear = () => {
    fetchData();
    setIsSelectOpen(false);
    clearSelectedItem();
  };

  const onViewMoreClick = () => {
    refetchData(pageIndex + 1);
  };

  return (
    <div className="position-relative">
      {serviceContainer.loading && serviceContainer.data && (
        <Spinner
          size="md"
          className={`${styles['search-select-spinner']} ${
            getFilterText() ? styles['search-select-spinner-filtered'] : styles['search-select-spinner-nofilter']
          }`}
        />
      )}
      <Select
        ref={selectRef}
        variant={SelectVariant.typeahead}
        onToggle={(isOpen) => {
          setIsSelectOpen(isOpen);
        }}
        onTypeaheadInputChanged={filterSelect}
        onSelect={selectItem}
        onFilter={() => {
          // filtering is not done here
          return undefined;
        }}
        onClear={clear}
        selections={selectedItem}
        isOpen={isSelectOpen}
        isInputValuePersisted={true}
        isInputFilterPersisted={true}
        placeholderText="string | !string | s?ring | st*ng"
        noResultsFoundText={serviceContainer.error ? serviceContainer.error : 'No results were found'}
        {...(!serviceContainer.loading &&
          !serviceContainer.error &&
          pageIndex < serviceContainer.data.totalPages && {
            loadingVariant: { text: 'View more', onClick: onViewMoreClick },
          })}
        {...(serviceContainer.loading && { loadingVariant: 'spinner' })}
      >
        {currentData.map((option: any, index: number) => (
          <SelectOption
            key={index}
            value={option[titleAttribute]}
            description={descriptionAttribute && option[descriptionAttribute]}
          />
        ))}
      </Select>
    </div>
  );
};
