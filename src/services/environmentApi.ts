import { AxiosRequestConfig } from 'axios';

import { BuildEnvironmentPage, Environment } from 'pnc-api-types-ts';

import { extendRequestConfig } from 'utils/requestConfigHelper';

import { pncClient } from './pncClient';

export interface IEnvironmentApiData {
  id: string;
}

/**
 * Gets all Environments.
 *
 * @param serviceData - object containing:
 *  - hidden - true = fetch only hidden Environments
 *           - false = fetch only Environments not hidden
 *           - otherwise, both hidden and not hidden
 *  - deprecated - true = fetch only deprecated Environments
 *               - false = fetch only Environments not deprecated
 *               - otherwise, both deprecated and not deprecated
 * @param requestConfig - Axios based request config
 */
export const getEnvironments = (
  { hidden, deprecated }: { hidden?: boolean; deprecated?: boolean },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<BuildEnvironmentPage>(
    '/environments',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [
          ...(hidden !== undefined
            ? [
                {
                  id: 'hidden',
                  value: hidden,
                  operator: '==',
                },
              ]
            : []),
          ...(deprecated !== undefined
            ? [
                {
                  id: 'deprecated',
                  value: deprecated,
                  operator: '==',
                },
              ]
            : []),
        ],
      },
    })
  );
};

/**
 * Gets a specific Environment.
 *
 * @param serviceData - object containing:
 *  - id - Environment ID
 * @param requestConfig - Axios based request config
 */
export const getBuild = ({ id }: IEnvironmentApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Environment>(`/environments/${id}`, requestConfig);
};
