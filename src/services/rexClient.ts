import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Rex HTTP client.
 */
class RexClient {
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
      baseURL: webConfigService.getRexUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const rexClient = new RexClient();
