import { AxiosRequestConfig } from 'axios';
import { kafkaClient } from './kafkaClient';
import { pncClient } from './pncClient';

class BuildService {
  path = '/builds';

  /**
   * Gets Build Metrics by a list of build Ids.
   *
   * @returns BuildMetrics
   */
  public getBuildMetrics(buildIds?: Array<string>, requestConfig: AxiosRequestConfig = {}) {
    if (buildIds) {
      return kafkaClient.getHttpClient().post(`${this.path}`, { buildIds }, requestConfig);
    }
  }

  /**
   * Gets Build Counts for enqueued, running, and waiting for dependencies builds.
   *
   * @returns numbers for "enqueued", "running", "waitingForDependencies"
   */
  public getBuildCount(requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`${this.path}/count`, requestConfig);
  }

  /**
   * Gets dependency graph for a build.
   * @returns DependencyGraph
   */
  public getDependencyGraph(id: string, requestConfig: AxiosRequestConfig = {}) {
    if (id) {
      return pncClient.getHttpClient().get(`${this.path}/${id}/dependency-graph`, requestConfig);
    }
  }
}

/**
 * Instance of BuildService providing group of Build related API operations.
 */
export const buildService = new BuildService();
