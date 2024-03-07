import axios, { AxiosInstance } from 'axios';

import { HttpClientCreationFailedError } from 'common/PncError';
import { Result } from 'common/Result';

import { uiLogger } from 'services/uiLogger';

import * as webConfigService from './webConfigService';

/**
 * Repour HTTP client.
 */
class RepourClient {
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
    const url = webConfigService.getRepourUrl();

    if (!url) {
      uiLogger.error('Repour URL not available in the config.');
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
        error: new HttpClientCreationFailedError({ message: 'Repour HTTP client could not be instantiated.' }),
      };
    }

    return { success: true, value: this.httpClient };
  };
}

export const repourClient = new RepourClient();
