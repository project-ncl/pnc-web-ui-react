import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IServiceContainer {
  data: any;
  loading: boolean;
  error: string;
  loadingStateDelayMs: number; // in milliseconds
  run: ServiceContainerRunnerFunction;
}

export interface IService<T = {}> {
  /**
   * Service data, eg { id: '2' }
   */
  serviceData?: T;

  /**
   * Axios based request config, eg { signal: <abortingSignal> }
   */
  requestConfig?: AxiosRequestConfig;
}

export type ServiceContainerRunnerFunction = (iService?: IService<Object | null>) => any;

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
export const useServiceContainer = (service: Function, loadingStateDelayMs: number = 200): IServiceContainer => {
  const ERROR_INIT: string = '';

  // initial states when component is loaded for the first time
  const [data, setData] = useState<any>(DataValues.notYetData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(ERROR_INIT);

  const loadingCount = useRef<number>(0);
  const lastAbortController = useRef<AbortController>();

  useEffect(() => {
    return () => {
      lastAbortController.current?.abort();
    };
  }, []);

  const serviceContainerRunner = ({ serviceData = null, requestConfig = {} }: IService<Object | null> = {}) => {
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

    return (serviceData ? service(serviceData, requestConfig) : service(requestConfig))
      .then((response: any) => {
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
          throw error;
        }
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
  };
};

const getErrorMessage = (error: Error | AxiosError): string => {
  if (isAxiosError(error)) {
    if (error.code === AxiosError.ERR_NETWORK) {
      return 'Action was not successful due to the network error. Please, try again.';
    }

    const genericErrorMessage = error.response?.data?.errorMessage ? error.response.data.errorMessage : error.toString();

    if (error.response?.status === 401) {
      return `Action was not successful, please login first and try again. [${genericErrorMessage}]`;
    }

    return genericErrorMessage;
  }

  return error.message;
};
