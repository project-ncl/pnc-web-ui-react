import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Bifrost HTTP client.
 */
class BifrostClient {
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
      baseURL: webConfigService.getBifrostUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const bifrostClient = new BifrostClient();
