import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { BuildConfigPage, GroupConfigPage, ProductMilestonePage, ProductReleasePage, ProductVersion } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IProductVersionApiData {
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
 * Creates a new Product Version.
 *
 * @param data - object containing new Product Version data
 * @param requestConfig - Axios based request config
 */
export const createProductVersion = ({ data }: { data: Omit<ProductVersion, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<ProductVersion>('/product-versions', data, requestConfig);
};

/**
 * Patches a Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchProductVersion = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<ProductVersion>(`/product-versions/${id}`, patchData, requestConfig);
};

/**
 * Gets Product Version statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<any>(`/product-versions/${id}/statistics`, requestConfig);
};

/**
 * Gets Product Version Artifact Quality statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getArtifactQualityStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<any>(`/product-versions/${id}/artifact-quality-statistics`, requestConfig);
};

/**
 * Gets Product Version Repository Type statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getRepositoryTypeStatistics = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<any>(`/product-versions/${id}/repository-type-statistics`, requestConfig);
};

/**
 * Gets Product Milestones of a Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getProductMilestones = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductMilestonePage>(`/product-versions/${id}/milestones`, requestConfig);
};

/**
 * Gets Product Releases of a Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getProductReleases = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductReleasePage>(`/product-versions/${id}/releases`, requestConfig);
};

/**
 * Gets Build Configs of a Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigs = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>(`/product-versions/${id}/build-configs`, requestConfig);
};

/**
 * Gets Group Configs of a Product Version.
 *
 * @param serviceData - object containing:
 *  - id - Product Version ID
 * @param requestConfig - Axios based request config
 */
export const getGroupConfigs = ({ id }: IProductVersionApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfigPage>(`/product-versions/${id}/group-configs`, requestConfig);
};
