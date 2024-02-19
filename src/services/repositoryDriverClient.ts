import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Repository Driver HTTP client.
 */
class RepositoryDriverClient {
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
      baseURL: webConfigService.getRepositoryDriverUrl(),
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const repositoryDriverClient = new RepositoryDriverClient();
