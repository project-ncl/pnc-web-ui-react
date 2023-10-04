import { AxiosRequestConfig } from 'axios';

import { BuildConfigPage, GroupBuild, GroupBuildPage, GroupConfigPage, GroupConfiguration } from 'pnc-api-types-ts';

import { extendRequestConfig } from 'utils/requestConfigHelper';

import { pncClient } from './pncClient';

interface IGroupConfigApiData {
  id: string;
}

/**
 * Gets all Group Configs.
 *
 * @param requestConfig - Axios based request config
 */
export const getGroupConfigs = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfigPage>('/group-configs', requestConfig);
};

/**
 * Gets all Group Configs with no assigned Product Version.
 *
 * @param requestConfig - Axios based request config
 */
export const getUnassignedGroupConfigs = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfigPage>(
    '/group-configs',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [
          {
            id: 'productVersion',
            value: true,
            operator: '=isnull=',
          },
        ],
      },
    })
  );
};

/**
 * Gets a specific Group Config.
 *
 * @param id - Group Config ID
 * @param requestConfig - Axios based request config
 */
export const getGroupConfig = ({ id }: IGroupConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfiguration>(`/group-configs/${id}`, requestConfig);
};

/**
 * Gets Group Builds of a Group Config.
 *
 * @param id - Group Config ID
 * @param requestConfig - Axios based request config
 */
export const getGroupBuilds = ({ id }: IGroupConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupBuildPage>(`/group-configs/${id}/group-builds`, requestConfig);
};

interface IGetByGroupConfigData {
  groupConfigId: string;
}

/**
 * Get Build Configs of a Group Config with the latest Build.
 *
 * @param groupConfigId - Group Config ID
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (
  { groupConfigId }: IGetByGroupConfigData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<BuildConfigPage>(
    '/build-configs/x-with-latest-build',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [
          {
            id: 'groupConfigurations.id',
            value: groupConfigId,
            operator: '==',
          },
        ],
      },
    })
  );
};

export interface IGroupBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  alignmentPreference?: string;
}

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
  return pncClient.getHttpClient().post<GroupBuild>(
    `/group-configs/${groupBuildStartParams.id}/build`,
    null,
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: groupBuildStartParams,
    })
  );
};
