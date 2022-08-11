import { AxiosRequestConfig } from 'axios';
import { pncClient } from './pncClient';

class GroupBuildService {
  path = '/group-builds';

  /**
   * Gets dependency graph for a build.
   * @returns DependencyGraph
   */
  public getDependencyGraph(id: string, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`${this.path}/${id}/dependency-graph`, requestConfig);
  }
}

/**
 * Instance of GroupBuildService providing group of Build related API operations.
 */
export const groupBuildService = new GroupBuildService();
