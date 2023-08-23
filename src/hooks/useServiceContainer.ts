import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IServiceContainer {
  data: any;
  loading: boolean;
  error: string;
  loadingStateDelay: number;
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
 * @param loadingStateDelay - Waiting time before loading state is activated
 * @returns Object with data, loading and error property
 */
export const useServiceContainer = (service: Function, loadingStateDelay: number = 200): IServiceContainer => {
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
    if (loadingStateDelay) {
      setTimeout(() => {
        if (loadingCount.current) {
          setLoading(true);
        }
      }, loadingStateDelay);
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
        let errorMessage: string;
        if (isAxiosError(error)) {
          errorMessage = error.response?.data?.errorMessage ? error.response.data.errorMessage : error.toString();
        } else {
          errorMessage = error.message;
        }

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
    loadingStateDelay,
    run: useCallback(serviceContainerRunner, [service, loadingStateDelay]),
  };
};
