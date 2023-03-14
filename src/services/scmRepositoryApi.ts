import { AxiosRequestConfig } from 'axios';

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
