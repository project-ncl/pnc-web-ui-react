import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { SCMRepository, SCMRepositoryPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IScmRepositoryApiData {
  id: string;
}

/**
 * Gets all SCM Repositories.
 *
 * @param requestConfig - Axios based request config
 */
export const getScmRepositories = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<SCMRepositoryPage>('/scm-repositories', requestConfig);
};

/**
 * Gets a specific SCM Repository.
 *
 * @param serviceData - object containing:
 *  - id - SCM Repository ID
 * @param requestConfig - Axios based request config
 */
export const getScmRepository = ({ id }: IScmRepositoryApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<SCMRepository>(`/scm-repositories/${id}`, requestConfig);
};

/**
 * Creates a new SCM Repository.
 *
 * @param data - object containing new SCM Repository data
 * @param requestConfig - Axios based request config
 */
export const createScmRepository = ({ data }: { data: Omit<SCMRepository, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<SCMRepository>('/scm-repositories', data, requestConfig);
};

/**
 * Patch a SCM Repository.
 *
 * @param serviceData - object containing:
 *  - id - SCMRepository ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchScmRepository = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<SCMRepository>(`/scm-repositories/${id}`, patchData, requestConfig);
};
