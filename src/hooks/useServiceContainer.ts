import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

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

export interface ServiceContainerData {
  data: any;
  loading: boolean;
  error: string;
  run: Function;
}

/**
 * React hook to manage data, loading and error states when data is being loaded. See also {@link ServiceContainerLoading} and {@link ServiceContainerCreatingUpdating}.
 *
 * Hook's request is terminated if unmounted from DOM.
 *
 * @param service - Service to be executed to load data
 * @param config - Config object, initLoadingState (provides init values for loading state)
 * @returns Object with data, loading and error property
 */
export const useServiceContainer = (
  service: Function,
  { initLoadingState = true }: { initLoadingState?: boolean } = {}
): ServiceContainerData => {
  const ERROR_INIT: string = '';

  // initial states when component is loaded for the first time
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(initLoadingState);
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
          setData(response.data);
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
        }
        throw error;
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
