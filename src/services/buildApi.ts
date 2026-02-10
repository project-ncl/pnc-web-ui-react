import { AxiosRequestConfig } from 'axios';

import {
  ArtifactPage,
  Build,
  BuildPage,
  BuildPushOperation,
  BuildPushOperationPage,
  BuildsGraph,
  RunningBuildCount,
} from 'pnc-api-types-ts';

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
  return pncClient.getHttpClient().get<BuildPage>('/builds', {
    ...requestConfig,
    params: {
      ...requestConfig.params,
      sort:
        requestConfig.params.sort !== 'none' ? `${requestConfig.params.sort},sort=desc=submitTime` : requestConfig.params.sort,
    },
  });
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
 * Gets Build Push operations of the Build.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildPushes = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPushOperationPage>(`/builds/${id}/build-push-operations`, requestConfig);
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

export const MAX_IMPLICIT_DEPENDENCY_GRAPH_DEPTH = 5;

/**
 * Gets Implicit Dependency Graph (based on built Artifacts) for a Build.
 *
 * @param serviceData
 *  - id - Build ID
 *  - depthLimit - Maximum depth of a graph from the node belonging to Build ID
 * @param requestConfig - Axios based request config
 */
export const getImplicitDependencyGraph = (
  { id, depthLimit = MAX_IMPLICIT_DEPENDENCY_GRAPH_DEPTH }: { id: string; depthLimit?: number },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<BuildsGraph>(
    `/builds/${id}/implicit-dependency-graph`,
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        depthLimit: depthLimit,
      },
    })
  );
};

/**
 * Gets implicit dependencies (built Artifacts) of one Build depending on another Build.
 *
 * @param serviceData
 *  - dependentId - ID of the Build using the Artifacts
 *  - dependencyId - ID of the Build which produced the Artifacts
 * @param requestConfig - Axios based request config
 */
export const getImplicitDependencies = (
  { dependentId, dependencyId }: { dependentId: string; dependencyId: string },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient
    .getHttpClient()
    .get<ArtifactPage>(`/builds/${dependentId}/artifacts/dependencies?q=build.id==${dependencyId}`, requestConfig);
};

/**
 * Pushes the Build to Brew.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const pushToBrew = (
  { id, data }: { id: string; data: { tagPrefix: string; reimport: string } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<BuildPushOperation>(`/builds/${id}/brew-push`, data, requestConfig);
};

/**
 * Cancels running Build.
 *
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const cancelBuild = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<undefined>(`/builds/${id}/cancel`, undefined, requestConfig);
};

/**
 * Edits quality of all Artifacts of a Build (bulk operation).
 * @param serviceData - object containing:
 *  - id - Build ID
 * @param requestConfig - Axios based request config
 */
export const editArtifactsQuality = ({ id }: IBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<undefined>(`/builds/${id}/artifacts/built/quality`, undefined, requestConfig);
};
