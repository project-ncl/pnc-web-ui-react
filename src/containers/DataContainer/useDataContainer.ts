import { AxiosRequestConfig } from 'axios';
import { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IService<T = {}> {
  /**
   * Service data, eg { id: '2' }
   */
  serviceData?: T;

  /**
   * Axios based request config, eg { signal: <abortingSignal> }
   */
  requestConfig: AxiosRequestConfig;
}

/**
 * React hook to manage data, loading and error states when data is being loaded. See also {@link DataContainer}.
 *
 * @param service - Service to be executed to load data
 * @returns Object with data, loading and error property
 */
export const useDataContainer = (service: Function) => {
  const ERROR_INIT: string = '';

  // initial states when component is loaded for the first time
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(ERROR_INIT);

  const loadingCount = useRef<number>(0);
  const lastAbortController = useRef<AbortController>();

  const invokeService = ({ serviceData = null, requestConfig = {} }: IService<any>) => {
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

    return service({ serviceData, requestConfig })
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
      .catch((error: Error) => {
        // execute only for last request
        if (loadingCount.current <= 1) {
          // In a future React version (potentially in React 17) this could be removed as it will be default behavior
          // https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
          ReactDOM.unstable_batchedUpdates(() => {
            setLoading(false);
            setError(error.toString());
          });
        }
        // #log
        console.error(error);
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
    refresh: invokeService,
  };
};
