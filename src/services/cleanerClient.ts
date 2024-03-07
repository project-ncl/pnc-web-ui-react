import axios, { AxiosInstance } from 'axios';

import { HttpClientCreationFailedError } from 'common/PncError';
import { Result } from 'common/Result';

import { uiLogger } from 'services/uiLogger';

import * as webConfigService from './webConfigService';

/**
 * Cleaner HTTP client.
 */
class CleanerClient {
  private httpClient: AxiosInstance | null;

  constructor() {
    this.httpClient = this.createHttpClient();
  }

  /**
   * Creates Axios instance.
   *
   * @returns Axios instance
   */
  private createHttpClient = (): AxiosInstance | null => {
    const url = webConfigService.getCleanerUrl();

    if (!url) {
      uiLogger.error('Cleaner URL not available in the config.');
      return null;
    }

    return axios.create({
      baseURL: url,
    });
  };

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): Result<AxiosInstance, HttpClientCreationFailedError> => {
    if (!this.httpClient) {
      return {
        success: false,
        error: new HttpClientCreationFailedError({ message: 'Cleaner HTTP client could not be instantiated.' }),
      };
    }

    return { success: true, value: this.httpClient };
  };
}

export const cleanerClient = new CleanerClient();
