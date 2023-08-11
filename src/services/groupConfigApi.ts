import { AxiosRequestConfig } from 'axios';

import { BuildConfigPage, GroupBuild, GroupConfigPage, GroupConfiguration } from 'pnc-api-types-ts';

import { addQParamItem } from 'utils/qParamHelper';

import { pncClient } from './pncClient';

export interface IGroupConfigApiData {
  id: string;
}

export interface IGroupBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  alignmentPreference?: string;
}

/**
 * Gets all GroupConfigs.
 *
 * @param requestConfig - Axios based request config
 */
export const getGroupConfigs = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfigPage>('/group-configs', requestConfig);
};

/**
 * Triggers a Group Build of a specific Group Config.
 *
 * @param groupBuildStartParams - Object containing parameters to start a Group Build
 * @param requestConfig - Axios based request config
 */
export const build = (
  { groupBuildStartParams }: { groupBuildStartParams: IGroupBuildStartParams },
  requestConfig: AxiosRequestConfig = {}
) => {
  requestConfig.params = requestConfig.params
    ? Object.assign(requestConfig.params, groupBuildStartParams)
    : groupBuildStartParams;
  return pncClient.getHttpClient().post<GroupBuild>(`/group-configs/${groupBuildStartParams.id}/build`, null, requestConfig);
};

/**
 * Gets a specific Group Config.
 *
 * @param id - The id of the Group Config
 * @param requestConfig - Axios based request config
 */
export const getGroupConfig = ({ id }: IGroupConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfiguration>(`/group-configs/${id}`, requestConfig);
};

/**
 * Gets all builds of a specific Group Config.
 *
 * @param id - The id of the Group Config
 * @param requestConfig - Axios based request config
 */
export const getGroupBuilds = ({ id }: IGroupConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfiguration>(`/group-configs/${id}/group-builds`, requestConfig);
};

interface IGetByGroupConfigData {
  groupConfigId?: string;
}

/**
 * Get all Build Configs of a Group Config with the latest Build.
 *
 * @param groupConfigId - The id of the Group Config
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (
  { groupConfigId }: IGetByGroupConfigData,
  requestConfig: AxiosRequestConfig = {}
) => {
  const qParam = addQParamItem(
    'groupConfigurations.id',
    groupConfigId!,
    '==',
    requestConfig?.params.q ? requestConfig.params.q : ''
  );
  const newRequestConfig = { ...requestConfig, params: { ...requestConfig.params, q: qParam } };
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', newRequestConfig);
};
