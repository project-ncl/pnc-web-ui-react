import { AxiosRequestConfig } from 'axios';

import { Build, BuildConfigPage, BuildConfigurationRevision } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  buildDependencies?: boolean;
  keepPodOnFailure?: boolean;
  alignmentPreference?: string;
}

/**
 * Gets all Build Configs.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigs = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs', requestConfig);
};

/**
 * Gets all BuildConfigs with latest build.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', requestConfig);
};

/**
 * Triggers a Build of a specific Build Config.
 *
 * @param buildStartParams - Object containing parameters to start a Build
 * @param requestConfig - Axios based request config
 */
export const build = ({ buildStartParams }: { buildStartParams: IBuildStartParams }, requestConfig: AxiosRequestConfig = {}) => {
  requestConfig.params = requestConfig.params ? Object.assign(requestConfig.params, buildStartParams) : buildStartParams;
  return pncClient.getHttpClient().post<Build>(`/build-configs/${buildStartParams.id}/build`, null, requestConfig);
};

/**
 * Gets specific audited revision of Build Config.
 *
 * @param serviceData - object containing:
 *  - buildConfigId - ID of the Build Config
 *  - buildConfigRev - Revision number of the Build Config
 * @param requestConfig - Axios based request config
 */
export const getRevision = (
  { buildConfigId, buildConfigRev }: { buildConfigId: string; buildConfigRev: number },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient
    .getHttpClient()
    .get<BuildConfigurationRevision>(`/build-configs/${buildConfigId}/revisions/${buildConfigRev}`, requestConfig);
};
