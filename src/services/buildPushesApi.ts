import { AxiosRequestConfig } from 'axios';

import { BuildPushReport } from 'pnc-api-types-ts';

import { pncClient } from 'services/pncClient';

export interface IBuildPushApi {
  id: string;
}

/**
 * Gets a Build Push Report.
 *
 * @param serviceData - object containing:
 *  - id - Build Push ID
 * @param requestConfig - Axios based request config
 */
export const getBuildPush = ({ id }: IBuildPushApi, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPushReport>(`/build-pushes/${id}`, requestConfig);
};
