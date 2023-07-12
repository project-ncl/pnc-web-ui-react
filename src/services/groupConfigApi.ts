import { AxiosRequestConfig } from 'axios';

import { GroupBuild, GroupConfigPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

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
