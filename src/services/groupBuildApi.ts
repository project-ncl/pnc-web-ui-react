import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

interface IGroupBuildApiData {
  id: string;
}

/**
 * Gets dependency graph for a group build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 * @returns DependencyGraph
 */
export const getDependencyGraph = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get(`/group-builds/${id}/dependency-graph`, requestConfig);
};
