import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Dependency Analyzer HTTP client.
 */
class DependencyAnalyzerClient {
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
      baseURL: webConfigService.getDependencyAnalyzerUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const dependencyAnalyzerClient = new DependencyAnalyzerClient();
