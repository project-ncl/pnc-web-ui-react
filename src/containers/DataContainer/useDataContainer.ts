import { useEffect, useState } from 'react';

/**
 * React hook to manage data, loading and error states when data is being loaded. See also {@link DataContainer}.
 *
 * @param service - Service to be executed to load data
 * @returns Object with data, loading and error property
 */
export const useDataContainer = (service: any) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    service()
      .then((response: any) => {
        setData(response.data.content);
      })
      .catch((error: string) => {
        setError(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });

    // disable linting, when `service` is useEffect dependency, there is infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
};
