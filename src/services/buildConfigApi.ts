import { AxiosRequestConfig } from 'axios';

import { Build } from 'pnc-api-types-ts';

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
 * Triggers a Build of a specific Build Config.
 *
 * @param buildStartParams - Object containing parameters to start a Build
 * @param requestConfig - Axios based request config
 */
export const build = ({ buildStartParams }: { buildStartParams: IBuildStartParams }, requestConfig: AxiosRequestConfig = {}) => {
  requestConfig.params = requestConfig.params ? Object.assign(requestConfig.params, buildStartParams) : buildStartParams;
  return pncClient.getHttpClient().post<Build>(`/build-configs/${buildStartParams.id}/build`, null, requestConfig);
};
