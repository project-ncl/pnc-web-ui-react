import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

/**
 * Gets an announcement message.
 *
 * @param requestConfig - Axios based request config
 * @returns Announcement message
 */
export const getAnnouncementBanner = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/generic-setting/announcement-banner', requestConfig);
};

/**
 * Creates an announcement message.
 *
 * @param serviceData - object containing:
 *  - message - announcement message
 * @param requestConfig - Axios based request config
 * @returns Created announcement message
 */
export const setAnnouncementBanner = ({ message }: { message: string }, requestConfig: AxiosRequestConfig = {}) => {
  const changedConfig = {
    ...requestConfig,
    headers: { ...requestConfig.headers, 'Content-Type': ' application/json;charset=UTF-8' },
  };

  return pncClient.getHttpClient().post('/generic-setting/announcement-banner', message, changedConfig);
};
