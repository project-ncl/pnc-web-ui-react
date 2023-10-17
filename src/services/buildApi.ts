import { AxiosRequestConfig } from 'axios';

import {
  ArtifactPage,
  Build,
  BuildPage,
  BuildPushResult,
  BuildsGraph,
  RunningBuildCount,
  SSHCredentials,
} from 'pnc-api-types-ts';

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

export interface IBuildApiData {
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
 * Gets Build Log of a Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getBuildLog = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<string>(`/builds/${id}/logs/build`, { ...requestConfig, responseType: 'text' });
};

/**
 * Gets Alignment Log of a Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getAlignmentLog = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<string>(`/builds/${id}/logs/align`, { ...requestConfig, responseType: 'text' });
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
 * Gets Brew Push of a Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getBrewPush = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPushResult>(`/builds/${id}/brew-push`, requestConfig);
};

/**
 * Gets Build Metrics by a list of build Ids.
 *
 * @param serviceData
 *  - buildIds - List of Build IDs
 * @param requestConfig - Axios based request config
 */
export const getBuildMetrics = ({ buildIds }: { buildIds: Array<string> }, requestConfig: AxiosRequestConfig = {}) => {
  return kafkaClient.getHttpClient().post<BuildMetrics>('/builds', { buildIds }, requestConfig);
};

/**
 * Gets SSH credentials of a Build created by the current user.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const getSshCredentials = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<SSHCredentials>(`/builds/ssh-credentials/${id}`, requestConfig);
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
