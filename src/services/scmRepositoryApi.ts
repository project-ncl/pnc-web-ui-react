import { AxiosRequestConfig } from 'axios';

import { SCMRepository } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IScmRepositoryApiData {
  id: string;
}

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
