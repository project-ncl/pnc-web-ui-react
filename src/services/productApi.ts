import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { Product, ProductPage, ProductVersionPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IProductApiData {
  id: string;
}

/**
 * Gets all Products.
 *
 * @param requestConfig - Axios based request config
 */
export const getProducts = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductPage>('/products', requestConfig);
};

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
 * Creates a new Product.
 *
 * @param data - object containing new Product data
 * @param requestConfig - Axios based request config
 */
export const createProduct = ({ data }: { data: Omit<Product, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<Product>('/products', data, requestConfig);
};

/**
 * Patch a Product.
 *
 * @param serviceData - object containing:
 *  - id - Product ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchProduct = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<Product>(`/products/${id}`, patchData, requestConfig);
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
