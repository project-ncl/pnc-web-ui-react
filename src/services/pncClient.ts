import axios, { AxiosInstance } from 'axios';

import { keycloakService } from './keycloakService';
import * as webConfigService from './webConfigService';

/**
 * Utils class managing http client instance, only one instance is created.
 */
class PncClient {
  private httpClient: AxiosInstance;
  public mathRandom: number = Math.random(); // development and testing purposes

  constructor() {
    this.httpClient = this.createHttpClient();
  }

  /**
   * Creates Axios instance and configure interceptors.
   *
   * @returns Axios instance
   */
  private createHttpClient = (): AxiosInstance => {
    const httpClient = axios.create({
      baseURL: webConfigService.getPncUrl(),
    });

    // perform actions before request is sent
    httpClient.interceptors.request.use(async (config) => {
      if (keycloakService.isKeycloakAvailable() && keycloakService.isAuthenticated()) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ` + (await keycloakService.getToken());
      }

      /*
       * Convert pageIndex to zero based to be compatible with Orch API
       *  - Orch API first page index value is 0
       *  - UI first page index value is 1
       */
      if (config.params?.pageIndex) {
        const pageIndex = config.params.pageIndex;
        if (Number.isInteger(+pageIndex)) {
          config.params.pageIndex = Number(pageIndex) - 1;
        } else {
          throw new Error(`Invalid pageIndex: ${pageIndex}, canceling HTTP request`);
        }
      }

      /**
       * If sorting is set to 'none', delete it from config.
       */
      if (config.params?.sort === 'none') {
        delete config.params.sort;
      }

      return config;
    });

    httpClient.defaults.headers.post['Content-Type'] = 'application/json';
    httpClient.defaults.headers.patch['Content-Type'] = 'application/json-patch+json';

    return httpClient;
  };

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient(): AxiosInstance {
    return this.httpClient;
  }
}

export const pncClient = new PncClient();
