import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

class GenericSettingsService {
  /**
   * Gets an announcement message.
   *
   * @param requestConfig - Axios based request config
   * @returns Announcement message
   */
  public getAnnouncementBanner(requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get('/generic-setting/announcement-banner', requestConfig);
  }

  /**
   * Creates an announcement message.
   *
   * @param message - announcement message
   * @param requestConfig - Axios based request config
   * @returns Creaeted announcement message
   */
  public setAnnouncementBanner(message: string, requestConfig: AxiosRequestConfig = {}) {
    const changedConfig = {
      ...requestConfig,
      headers: { ...requestConfig.headers, 'Content-Type': ' application/json;charset=UTF-8' },
    };

    return pncClient.getHttpClient().post('/generic-setting/announcement-banner', message, changedConfig);
  }
}

/**
 * Instance of GenericService providing group of generic API operations.
 */
export const genericSettingsService = new GenericSettingsService();
