import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Causeway HTTP client.
 */
class CausewayClient {
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
      baseURL: webConfigService.getCausewayUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const causewayClient = new CausewayClient();
