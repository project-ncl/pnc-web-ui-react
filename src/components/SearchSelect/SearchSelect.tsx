import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

type FetchCallbackFunction = (requstConfig: AxiosRequestConfig) => Promise<AxiosResponse<any, any>>;
type OnSelectFunction = (value: string | SelectOptionObject) => void;

interface ISearchSelectProps {
  fetchCallback: FetchCallbackFunction;
  attribute: string;
  onSelect: OnSelectFunction;
  delay?: number;
  pageSize?: number;
  shouldDisplayDescription?: boolean;
}

/**
 * Filtered select with data dynamically fetched from backend.
 * Select options data are fetched:
 *  -> when select is firstly loaded
 *    -> these are buffered so they are not refetched
 *  -> when filter input text is changed (by typing or selecting option)
 *    -> these are filtered by attribute equality to current filter text value (=like= operator)
 *
 * onSelect callback is used so selected option is accessible from outside.
 *
 * @param fetchCallback - function to fetch the data from backend
 * @param attribute - which attribute will be filtered
 * @param onSelect - function to be called when option is selected (value is passed in)
 * @param delay - delay after which data are fetched when filter input is changed
 * @param pageSize - count of entries fetched
 * @param shouldDisplayDescription - should options display description? (if any)
 */
export const SearchSelect = ({
  fetchCallback,
  attribute,
  onSelect,
  delay = 200,
  pageSize = 20,
  shouldDisplayDescription = false,
}: ISearchSelectProps) => {
  // newest (filtered) data downloaded using callback
  const [currentData, setCurrentData] = useState<any[]>([]);
  // data downloaded on first load
  const [defaultData, setDefaultData] = useState<any[]>([]);
  // currenyly selected option
  const [selected, setSelected] = useState<string | undefined>();

  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  // used to fetch data after delay
  const timeout = useRef<NodeJS.Timeout>();
  const lastAbortController = useRef<AbortController>();

  // fetch data and save them
  // if filterText string is empty, default data are saved
  const fetchData = useCallback(
    (filterText: string = '') => {
      const requstConfig: AxiosRequestConfig = { params: { pageSize } };
      if (filterText) {
        requstConfig.params.q = `${attribute}=like="%${filterText}%"`;
      }

      // abort previous request
      lastAbortController.current?.abort();
      // create abort signal for new request
      lastAbortController.current = new AbortController();
      requstConfig.signal = lastAbortController.current.signal;

      setLoading(true);

      fetchCallback(requstConfig)
        .then((response: any) => {
          const data = response.data.content;
          setCurrentData(data);
          if (filterText === '') setDefaultData(data);
          setLoading(false);
        })
        .catch((error: any) => {
          // if no other request is processed
          if (lastAbortController.current?.signal.aborted) {
            setLoading(false);
          }
        });
    },
    [fetchCallback, attribute, pageSize]
  );

  // load first / default data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // filtering of select
  const filterSelect = (value: string) => {
    // if text filter changed, unselect
    clearSelection();

    clearTimeout(timeout?.current);
    if (value !== '') {
      timeout.current = setTimeout(() => fetchData(value), delay);
    } else {
      // if filter is empty string, set default options and abort request
      setCurrentData(defaultData);
      lastAbortController.current?.abort();
    }
  };

  // selecting an option
  const onSelectInner = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder: boolean | undefined
  ) => {
    if (isPlaceholder) clearSelect();
    else {
      if (event) {
        // do this only when select option is clicked
        // (for some reason, this function is called also on blur)

        // set options to an empty array for a while so loading state is visible
        setCurrentData([]);
        fetchData(selection as string);
        onSelect(selection);
      }
      setSelected(selection as string);
      setIsSelectOpen(false);
    }
  };

  // if anything was selected, unselect it
  const clearSelection = () => {
    if (selected) {
      setSelected(undefined);
      onSelect('');
    }
  };

  // on clear, set default values
  const clearSelect = () => {
    setCurrentData(defaultData);
    setIsSelectOpen(false);
    clearSelection();
    lastAbortController.current?.abort();
  };

  return (
    <Select
      variant={SelectVariant.typeahead}
      onToggle={(isOpen) => {
        setIsSelectOpen(isOpen);
      }}
      onTypeaheadInputChanged={filterSelect}
      onSelect={onSelectInner}
      onFilter={() => {
        // filtering is not done here
        return undefined;
      }}
      loadingVariant={loading ? 'spinner' : undefined}
      onClear={clearSelect}
      selections={selected}
      isOpen={isSelectOpen}
      isInputValuePersisted={true}
      isInputFilterPersisted={true}
    >
      {currentData.map((option: any, index: number) => (
        <SelectOption key={index} value={option[attribute]} description={shouldDisplayDescription && option.description} />
      ))}
    </Select>
  );
};
