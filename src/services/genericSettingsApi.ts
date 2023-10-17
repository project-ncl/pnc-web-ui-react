import { AxiosRequestConfig } from 'axios';

import { Banner } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

/**
 * Gets an announcement message.
 *
 * @param requestConfig - Axios based request config
 */
export const getAnnouncementBanner = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Banner>('/generic-setting/announcement-banner', requestConfig);
};

/**
 * Creates an announcement message.
 *
 * @param serviceData - object containing:
 *  - message - announcement message
 * @param requestConfig - Axios based request config
 */
export const setAnnouncementBanner = ({ message }: { message: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<undefined>('/generic-setting/announcement-banner', message, requestConfig);
};

/**
 * Gets PNC version.
 *
 * @param requestConfig - Axios based request config
 */
export const getPncVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<string>('/generic-setting/pnc-version', requestConfig);
};

/**
 * Sets PNC version.
 *
 * @param serviceData - object containing:
 *  - version - PNC version
 * @param requestConfig - Axios based request config
 */
export const setPncVersion = ({ version }: { version: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<undefined>('/generic-setting/pnc-version', version, requestConfig);
};
