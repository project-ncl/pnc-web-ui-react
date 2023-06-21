import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IServiceContainer {
  data: any;
  loading: boolean;
  error: string;
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

/**
 * React hook to manage data, loading and error states when data is being loaded. See also {@link ServiceContainerLoading} and {@link ServiceContainerCreatingUpdating}.
 *
 * Hook's request is terminated if unmounted from DOM.
 *
 * @param service - Service to be executed to load data
 * @returns Object with data, loading and error property
 */
export const useServiceContainer = (service: Function): IServiceContainer => {
  const ERROR_INIT: string = '';

  // initial states when component is loaded for the first time
  const [data, setData] = useState<any>(undefined); // undefined = service not executed yet
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
    setTimeout(() => {
      if (loadingCount.current) {
        setLoading(true);
      }
    }, 200);

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
          // Convert undefined to null
          // undefined is reserved for "service not executed yet"
          if (response.data === undefined) {
            setData(null);
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
    data: data,
    loading: loading,
    error: error,
    run: useCallback(serviceContainerRunner, [service]),
  };
};
