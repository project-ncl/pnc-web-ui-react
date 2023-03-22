import { AxiosRequestConfig } from 'axios';

import { ProductVersion } from 'pnc-api-types-ts';

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
