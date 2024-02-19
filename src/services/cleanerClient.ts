import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Cleaner HTTP client.
 */
class CleanerClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = this.createHttpClient();
  }

  /**
   * Creates Axios instance.
   *
   * @returns Axios instance
   */
  private createHttpClient = (): AxiosInstance =>
    axios.create({
      baseURL: webConfigService.getCleanerUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const cleanerClient = new CleanerClient();
