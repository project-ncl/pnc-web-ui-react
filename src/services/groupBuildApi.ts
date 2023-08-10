import { AxiosRequestConfig } from 'axios';

import { BuildsGraph, GroupBuildPage } from 'pnc-api-types-ts';

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
 * Gets dependency graph for a group build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const getDependencyGraph = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildsGraph>(`/group-builds/${id}/dependency-graph`, requestConfig);
};
