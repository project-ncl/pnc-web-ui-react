import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { ProductRelease } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IProductReleaseApiData {
  id: string;
}

/**
 * Gets a specific Product Release.
 *
 * @param serviceData - object containing:
 *  - id - Product Release ID
 * @param requestConfig - Axios based request config
 */
export const getProductRelease = ({ id }: IProductReleaseApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductRelease>(`/product-releases/${id}`, requestConfig);
};

/**
 * Creates a new Product Release.
 *
 * @param data - object containing new Product Release data
 * @param requestConfig - Axios based request config
 */
export const createProductRelease = ({ data }: { data: Omit<ProductRelease, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<ProductRelease>('/product-releases', data, requestConfig);
};

/**
 * Patches a Product Release.
 *
 * @param serviceData - object containing:
 *  - id - Product Release ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchProductRelease = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<ProductRelease>(`/product-releases/${id}`, patchData, requestConfig);
};
