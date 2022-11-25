import { AxiosRequestConfig } from 'axios';

import { kafkaClient } from './kafkaClient';
import { pncClient } from './pncClient';

interface IBuildApiData {
  id: string;
}

/**
 * Gets Build Metrics by a list of build Ids.
 *
 * @returns BuildMetrics
 */
export const getBuildMetrics = (buildIds?: Array<string>, requestConfig: AxiosRequestConfig = {}) => {
  if (buildIds) {
    return kafkaClient.getHttpClient().post('/builds', { buildIds }, requestConfig);
  }
};

/**
 * Gets Build Counts for enqueued, running, and waiting for dependencies builds.
 *
 * @returns numbers for "enqueued", "running", "waitingForDependencies"
 */
export const getBuildCount = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/builds/count', requestConfig);
};

/**
 * Gets dependency graph for a build.
 *
 * @param data - object containing ID of the Build
 * @param requestConfig - Axios based request config
 * @returns DependencyGraph
 */
export const getDependencyGraph = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get(`/builds/${id}/dependency-graph`, requestConfig);
};
