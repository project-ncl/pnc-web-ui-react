import { AxiosRequestConfig } from 'axios';

import { ArtifactPage, Build, BuildPage, BuildPushResult, BuildsGraph, RunningBuildCount } from 'pnc-api-types-ts';

import { pncApiMocksClient } from 'services/pncApiMocksClient';

import { extendRequestConfig } from 'utils/requestConfigHelper';

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
 * Gets all Builds.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuilds = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>('/builds', requestConfig);
};

/**
 * Gets Builds of a User.
 *
 * @param serviceData - object containing:
 *  - userId - User ID
 * @param requestConfig - Axios based request config
 */
export const getUserBuilds = ({ userId }: { userId: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(
    '/builds',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [
          {
            id: 'user.id',
            value: userId,
            operator: '==',
          },
        ],
      },
    })
  );
};

/**
 * Gets a specific Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getBuild = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Build>(`/builds/${id}`, requestConfig);
};

/**
 * Gets Artifacts built in a Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getBuiltArtifacts = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/builds/${id}/artifacts/built`, requestConfig);
};

/**
 * Gets dependency Artifacts of a Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getDependencies = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/builds/${id}/artifacts/dependencies`, requestConfig);
};

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

/**
 * Gets Build Artifact dependency graph.
 *
 * @param serviceData
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getArtifactDependencyGrah = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncApiMocksClient.getHttpClient().get<any>(`/builds/${id}/artifact-dependency-graph`, requestConfig);
};

/**
 * Gets Artifact dependencies of one Build dependent on another Build.
 *
 * @param requestConfig - Axios based request config
 */
export const getArtifactDependencies = (requestConfig: AxiosRequestConfig = {}) => {
  return pncApiMocksClient.getHttpClient().get<any>(`/build-artifact-dependencies`, requestConfig);
};

/**
 * Pushes the Build to Brew.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const pushToBrew = ({ id, data }: { id: string; data: { tagPrefix: string } }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<BuildPushResult>(`/builds/${id}/brew-push`, data, requestConfig);
};
