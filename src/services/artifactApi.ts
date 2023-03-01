import { AxiosRequestConfig } from 'axios';

import { ArtifactPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

/**
 * Gets all Artifacts.
 *
 * @param requestConfig - Axios based request config
 */
export const getArtifacts = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>('/artifacts', requestConfig);
};
