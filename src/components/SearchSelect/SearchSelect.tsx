import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { FILTERING_PLACEHOLDER_DEFAULT } from 'common/constants';

import { IRegisterData } from 'hooks/useForm';
import { IServiceDataPaginated, areServiceDataPaginated, useServiceContainer } from 'hooks/useServiceContainer';

import { TypeaheadSelect } from 'components/TypeaheadSelect/TypeaheadSelect';

const pageIndexDefault = 1;

type Entity = Record<string, any>;

interface ISearchSelectProps<T extends Entity> {
  selectedValue: string | undefined;
  onSelect: (selectedValue: string, selectedEntity?: T) => void;
  onClear: () => void;
  fetchCallback: (requestConfig?: AxiosRequestConfig) => Promise<
    AxiosResponse<
      Omit<IServiceDataPaginated<T>, 'content'> & {
        content?: T[];
      },
      any
    >
  >;
  delayMilliseconds?: number;
  pageSizeDefault?: number;
  titleAttribute: keyof T & string;
  descriptionAttribute?: keyof T & string;
  getCustomDescription?: (entity: T) => ReactNode;
  placeholderText?: string;
  validated?: IRegisterData<any>['validated'];
  width?: number;
  isDisabled?: boolean;
}

/**
 * Filtrable select with data dynamically fetched from backend.
 * Select options data are fetched:
 *  -> when select is firstly loaded
 *  -> when filter input text is changed
 *
 * Filtered by: 'titleAttribute =like= current filter text value'
 * If descriptionAttribute is defined: 'descriptionAttribute =like= current filter operation' is also appended
 * by OR operator
 *
 * @param selectedValue - value currently selected in the menu
 * @param onSelect - callback setting selectedValue state
 * @param onClear - callback unselecting selectedValue state
 * @param fetchCallback - function to fetch the data from backend
 * @param delayMilliseconds - fetch delay for filter input change
 * @param pageSizeDefault - count of entries per page fetched by default
 * @param titleAttribute - primary attribute to filter by (in query params), displayed as option name
 * @param descriptionAttribute - secondary attribute to filter by (in query params), displayed as option description (if getCustomDescription is undefined)
 * @param getCustomDescription - callback to construct the option description based on the option entity
 * @param placeholderText - text displayed in the empty text input
 * @param validated - state of validation in the form state
 * @param width - width of select toggle button / text input
 * @param isDisabled - whether is select disabled
 */
export const SearchSelect = <T extends Entity>({
  selectedValue,
  onSelect,
  onClear,
  fetchCallback,
  delayMilliseconds = 200,
  pageSizeDefault = 10,
  titleAttribute,
  descriptionAttribute,
  getCustomDescription,
  placeholderText = FILTERING_PLACEHOLDER_DEFAULT,
  validated,
  width,
  isDisabled = false,
}: ISearchSelectProps<T>) => {
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState<boolean>(false);

  const [fetchedData, setFetchedData] = useState<T[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(pageIndexDefault);

  const fetchTimeout = useRef<NodeJS.Timeout>();

  const serviceContainer = useServiceContainer(fetchCallback);
  const serviceContainerRunner = serviceContainer.run;

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
          const data = result.response.data?.content || [];
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onMenuSelect = (selectedValue: string) => {
    onSelect(
      selectedValue,
      fetchedData.find((value) => value[titleAttribute] === selectedValue)
    );
  };

  const onFilter = (inputValue: string) => {
    clearTimeout(fetchTimeout?.current);
    fetchTimeout.current = setTimeout(() => fetchData(inputValue), delayMilliseconds);
  };

  const onViewMoreClick = (inputValue: string) => {
    fetchData(inputValue, pageIndex + 1);
  };

  const onClearButtonClick = () => {
    if (selectedValue) {
      onClear();
    } else {
      fetchData();
    }
  };

  return (
    <div className="position-relative" style={{ width: `${width}px` }}>
      <TypeaheadSelect
        selectOptions={fetchedData.map((entity) => {
          const title = entity[titleAttribute];
          const description = getCustomDescription
            ? getCustomDescription(entity)
            : descriptionAttribute && entity[descriptionAttribute];

          return { value: title, children: title, description };
        })}
        isMenuOpen={isSelectMenuOpen}
        onMenuToggle={setIsSelectMenuOpen}
        selectedValue={selectedValue}
        onSelect={onMenuSelect}
        onInputChange={onFilter}
        onViewMore={onViewMoreClick}
        isViewMoreDisabled={
          !areServiceDataPaginated(serviceContainer.data) ||
          !serviceContainer.data?.totalPages ||
          pageIndex >= serviceContainer.data.totalPages
        }
        onClear={onClearButtonClick}
        isFiltrable={false}
        placeholderText={placeholderText}
        validated={validated}
        isLoading={serviceContainer.loading}
        errorMessage={serviceContainer.error}
        isDisabled={isDisabled}
      />
    </div>
  );
};
