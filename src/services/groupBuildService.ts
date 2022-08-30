import { AxiosRequestConfig } from 'axios';
import { pncClient } from './pncClient';

interface IGroupBuildServiceData {
  id: string;
}

class GroupBuildService {
  path = '/group-builds';

  /**
   * Gets dependency graph for a group build.
   * @param data - object containing ID of the Group Build
   * @param requestConfig - Axios based request config
   * @returns DependencyGraph
   */
  public getDependencyGraph({ id }: IGroupBuildServiceData, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`${this.path}/${id}/dependency-graph`, requestConfig);
  }
}

/**
 * Instance of GroupBuildService providing group of Build related API operations.
 */
export const groupBuildService = new GroupBuildService();
