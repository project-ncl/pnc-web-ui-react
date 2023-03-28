import { AxiosRequestConfig } from 'axios';

import { ProductVersion } from 'pnc-api-types-ts';

import { mockClient } from 'services/mockClient';

import { pncClient } from './pncClient';

interface IProductVersionApiData {
  id: string;
}

/**
 * Gets a specific Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getProductVersion = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductVersion>(`/product-versions/${id}`, requestConfig);
};

/**
 * Gets Product Version statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return mockClient.getHttpClient().get<any>(`/product-versions/${id}/statistics`, requestConfig);
};

/**
 * Gets Product Version Artifact Quality statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getArtifactQualityStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return mockClient.getHttpClient().get<any>(`/product-versions/${id}/artifact-quality-statistics`, requestConfig);
};

/**
 * Gets Product Version Repository Type statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getRepositoryTypeStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return mockClient.getHttpClient().get<any>(`/product-versions/${id}/repository-type-statistics`, requestConfig);
};
