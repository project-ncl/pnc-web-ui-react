import { AxiosRequestConfig } from 'axios';

import { BuildsGraph, GroupBuildPage } from 'pnc-api-types-ts';

import { addQParamItem } from 'utils/qParamHelper';

import { pncClient } from './pncClient';

interface IGroupBuildApiData {
  id: string;
}

/**
 * Gets all Group Builds.
 *
 * @param requestConfig - Axios based request config
 */
export const getGroupBuilds = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupBuildPage>('group-builds', requestConfig);
};

/**
 * Gets Group Builds of a User.
 *
 * @param serviceData - object containing:
 *  - userId - User ID
 * @param requestConfig - Axios based request config
 */
export const getUserGroupBuilds = ({ userId }: { userId: string }, requestConfig: AxiosRequestConfig = {}) => {
  // TODO: extend request config by user ID with the helper function
  const qParam = addQParamItem('user.id', userId, '==', requestConfig?.params.q ? requestConfig.params.q : '');
  const newRequestConfig = { ...requestConfig, params: { ...requestConfig.params, q: qParam } };

  return pncClient.getHttpClient().get<GroupBuildPage>('/group-builds', newRequestConfig);
};

/**
 * Gets dependency graph for a group build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const getDependencyGraph = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildsGraph>(`/group-builds/${id}/dependency-graph`, requestConfig);
};
