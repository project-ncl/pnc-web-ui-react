import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Mocked backend client. Use for WIP features.
 */
class PncApiMocksClient {
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
      baseURL: import.meta.env.VITE_PNC_API_MOCKS_URL || webConfigService.getPncApiMocksUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const pncApiMocksClient = new PncApiMocksClient();
