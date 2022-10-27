import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

/**
 * Gets current user.
 *
 * @param requestConfig - Axios based request config
 * @returns Current user
 */
export const getCurrentUser = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/users/current', requestConfig);
};
