import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Deliverables Analyzer HTTP client.
 */
class DeliverablesAnalyzerClient {
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
      baseURL: webConfigService.getDeliverablesAnalyzerUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const deliverablesAnalyzerClient = new DeliverablesAnalyzerClient();
