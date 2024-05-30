import { AxiosError, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { backendErrorMessageMapper } from 'common/backendErrorMessageMapper';

export type TServiceData = Object | undefined;

interface IServiceDataPaginated<T extends Object> {
  content: T[];
  pageIndex?: number;
  pageSize?: number;
  totalHits?: number;
  totalPages?: number;
}

export type TServiceParams = Object | undefined;

type ServiceFunctionWithParams<T extends TServiceData, U extends TServiceParams> = (
  serviceData: U,
  requestConfig?: AxiosRequestConfig
) => Promise<AxiosResponse<T>>;

type ServiceFunctionWithoutParams<T extends TServiceData> = (requestConfig?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;

type ServiceFunction<T extends TServiceData, U extends TServiceParams> =
  | ServiceFunctionWithParams<T, U>
  | ServiceFunctionWithoutParams<T>;

export interface IService<U extends TServiceParams> {
  /**
   * Service data, eg { id: '2' }
   */
  serviceData?: U;

  /**
   * Axios based request config, eg { signal: <abortingSignal> }
   */
  requestConfig?: AxiosRequestConfig;
}

export type ServiceContainerRunnerFunction<T extends TServiceData, U extends TServiceParams> = (
  iService?: IService<U>
) => Promise<AxiosResponse<T>>;

/**
 * Use when only data and state of the service is needed and possibly, 'run' function params are unknown.
 */
export interface IServiceContainerState<T extends TServiceData> {
  data: T | undefined | null;
  loading: boolean;
  error: string;
  loadingStateDelayMs: number; // in milliseconds
}

/**
 * Unlike IServiceContainerState, also for example service 'run' function is provided.
 * When service need to be executed, prefer to use this interface over IServiceContainerState.
 */
export interface IServiceContainer<T extends TServiceData, U extends TServiceParams> extends IServiceContainerState<T> {
  setData: Dispatch<SetStateAction<IServiceContainerState<T>['data']>>;
  run: ServiceContainerRunnerFunction<T, U>;
}

export const DataValues = {
  /**
   * Service execution not started yet or pending
   */
  notYetData: undefined,

  /**
   * Service is settled, it can be:
   *  1) fulfilled with empty data or
   *  2) rejected -> error attribute contains more details
   */
  noData: null,
} as const;

/**
 * React hook to manage data, loading and error states when data is being loaded. See also {@link ServiceContainerLoading} and {@link ServiceContainerCreatingUpdating}.
 *
 * Hook's request is terminated if unmounted from DOM.
 *
 * @param service - Service to be executed to load data
 * @param loadingStateDelayMs - Waiting time before loading state is activated (in milliseconds)
 * @returns Object with data, loading and error property
 */
export const useServiceContainer = <T extends TServiceData, U extends TServiceParams>(
  service: ServiceFunction<T, U>,
  loadingStateDelayMs: number = 200
): IServiceContainer<T, U> => {
  const ERROR_INIT: string = '';

  // initial states when component is loaded for the first time
  const [data, setData] = useState<IServiceContainerState<T>['data']>(DataValues.notYetData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(ERROR_INIT);

  const loadingCount = useRef<number>(0);
  const lastAbortController = useRef<AbortController>();

  useEffect(() => {
    return () => {
      lastAbortController.current?.abort();
    };
  }, []);

  const serviceContainerRunner = ({ serviceData = undefined, requestConfig = {} }: IService<U> = {}) => {
    loadingCount.current++;

    // set delayed (delayed to prevent flashing experience and unnecessary renders) loading state
    if (loadingStateDelayMs) {
      setTimeout(() => {
        if (loadingCount.current) {
          setLoading(true);
        }
      }, loadingStateDelayMs);
    } else {
      setLoading(true);
    }

    // abort previous request
    lastAbortController.current?.abort();

    // create abort signal for new request
    lastAbortController.current = new AbortController();
    requestConfig.signal = lastAbortController.current.signal;

    return (
      serviceData
        ? (service as ServiceFunctionWithParams<T, U>)(serviceData, requestConfig)
        : (service as ServiceFunctionWithoutParams<T>)(requestConfig)
    )
      .then((response) => {
        // In a future React version (potentially in React 17) this could be removed as it will be default behavior
        // https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
        ReactDOM.unstable_batchedUpdates(() => {
          setLoading(false);

          /**
           * Convert undefined to {@link DataValues.noData} as
           * undefined is reserved for {@link DataValues.notYetData}
           */
          if (response.data === undefined) {
            setData(DataValues.noData);
          } else {
            setData(response.data);
          }
          setError(ERROR_INIT);
        });

        return response;
      })
      .catch((error: Error | AxiosError) => {
        const errorMessage = getErrorMessage(error);

        if (error.name !== 'CanceledError') {
          // execute only for last request
          if (loadingCount.current <= 1) {
            // In a future React version (potentially in React 17) this could be removed as it will be default behavior
            // https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
            ReactDOM.unstable_batchedUpdates(() => {
              setLoading(false);
              setError(errorMessage);
              setData(DataValues.noData);
            });
          }
        }

        throw error;
      })
      .finally(() => {
        loadingCount.current--;
      });
  };

  return {
    /**
     * There are 3 possible values for data attribute:
     * 1) and 2) see {@link DataValues}
     * 3) data = service is fulfilled with non-empty data
     */
    data: data,

    loading: loading,
    error: error,
    loadingStateDelayMs,
    run: useCallback(serviceContainerRunner, [service, loadingStateDelayMs]),
    setData,
  };
};

export const getErrorMessage = (error: Error | AxiosError): string => {
  if (isAxiosError(error)) {
    if (error.code === AxiosError.ERR_NETWORK) {
      return 'Action was not successful due to the network error. Please, try again.';
    }

    const genericErrorMessage = error.response?.data?.errorMessage ?? error.response?.data?.message ?? error.toString();
    const errorStatusCode = error.response?.status ?? 0;
    const backendErrorMessage = backendErrorMessageMapper(errorStatusCode, genericErrorMessage);

    return backendErrorMessage;
  }

  return error.message;
};

export const areServiceDataPaginated = (data: IServiceContainerState<Object>['data']): data is IServiceDataPaginated<Object> =>
  !!data && typeof data === 'object' && 'content' in data;
