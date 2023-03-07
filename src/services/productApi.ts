import { AxiosRequestConfig } from 'axios';

import { Product, ProductVersionPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IProductApiData {
  id: string;
}

/**
 * Gets a specific Product.
 *
 * @param serviceData - object containing:
 *  - id - Product ID
 * @param requestConfig - Axios based request config
 */
export const getProduct = ({ id }: IProductApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Product>(`/products/${id}`, requestConfig);
};

/**
 * Gets Product Versions of a Product.
 *
 * @param serviceData - object containing:
 *  - id - Product ID
 * @param requestConfig - Axios based request config
 */
export const getProductVersions = ({ id }: IProductApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductVersionPage>(`/products/${id}/versions`, requestConfig);
};
