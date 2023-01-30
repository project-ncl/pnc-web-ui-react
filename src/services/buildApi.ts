import { AxiosRequestConfig } from 'axios';

import { BuildsGraph, RunningBuildCount } from 'pnc-api-types-ts';

import { kafkaClient } from './kafkaClient';
import { pncClient } from './pncClient';

interface BuildMetrics {
  [index: number]: {
    name: string;
    data: number[];
  };
}

interface IBuildApiData {
  id: string;
}

/**
 * Gets Build Metrics by a list of build Ids.
 *
 * @param serviceData
 *  - buildIds - List of Build IDs
 * @param requestConfig - Axios based request config
 */
export const getBuildMetrics = ({ buildIds }: { buildIds?: Array<string> }, requestConfig: AxiosRequestConfig = {}) => {
  if (buildIds) {
    return kafkaClient.getHttpClient().post<BuildMetrics>('/builds', { buildIds }, requestConfig);
  }
};

/**
 * Gets Build Counts for enqueued, running, and waiting for dependencies builds.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildCount = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<RunningBuildCount>('/builds/count', requestConfig);
};

/**
 * Gets dependency graph for a build.
 *
 * @param serviceData
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getDependencyGraph = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildsGraph>(`/builds/${id}/dependency-graph`, requestConfig);
};
