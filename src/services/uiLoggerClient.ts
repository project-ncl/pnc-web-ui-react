import axios, { AxiosInstance } from 'axios';

import * as webConfigService from 'services/webConfigService';

/**
 * Utils class managing http client instance, only one instance is created.
 */
class UILoggerClient {
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
      baseURL: webConfigService.getUILoggerUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient(): AxiosInstance {
    return this.httpClient;
  }
}

export const uiLoggerClient = new UILoggerClient();
