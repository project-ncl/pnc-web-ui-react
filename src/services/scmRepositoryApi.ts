import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { BuildConfigPage, SCMRepository, SCMRepositoryPage } from 'pnc-api-types-ts';

import { RepositoryCreationResponseCustomized } from 'common/types';

import { extendRequestConfig } from 'utils/requestConfigHelper';
import { convertTaskId } from 'utils/utils';

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
 * Gets all SCM Repositories filtered by parameters.
 *
 * @param serviceData - object containing:
 *  - matchUrl - external URL to search for
 * @param requestConfig - Axios based request config
 */
export const getScmRepositoriesFiltered = ({ matchUrl }: { matchUrl?: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<SCMRepositoryPage>(
    '/scm-repositories',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        ...(matchUrl ? { url: matchUrl } : {}),
      },
    })
  );
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
  // See NCL-8433
  requestConfig.transformResponse = [(response: string) => JSON.parse(convertTaskId(response))];
  return pncClient
    .getHttpClient()
    .post<RepositoryCreationResponseCustomized>('/scm-repositories/create-and-sync', data, requestConfig);
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

interface IGetByScmRepositoryData {
  scmRepositoryId: string;
}

/**
 * Get all Build Configs of a SCM Repository with the latest Build.
 *
 * @param scmRepositoryId - SCM Repository ID
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (
  { scmRepositoryId }: IGetByScmRepositoryData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<BuildConfigPage>(
    '/build-configs/x-with-latest-build',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [{ id: 'scmRepository.id', value: scmRepositoryId, operator: '==' }],
      },
    })
  );
};
