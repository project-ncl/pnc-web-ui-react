import { AxiosRequestConfig } from 'axios';

import { User } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

/**
 * Gets current user.
 *
 * @param requestConfig - Axios based request config
 */
export const getCurrentUser = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<User>('/users/current', requestConfig);
};
