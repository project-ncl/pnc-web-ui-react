import axios, { AxiosInstance } from 'axios';
import * as WebConfigAPI from './WebConfigService';
import { keycloakService } from './keycloakService';

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
      baseURL: WebConfigAPI.getPncUrl(),
    });

    httpClient.interceptors.request.use((config) => {
      // perform actions before request is sent
      const token = keycloakService.getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ` + token;
      }

      /*
       * Convert pageIndex to zero based to be compatible with Orch API
       *  - Orch API first page index value is 0
       *  - UI first page index value is 1
       */
      if (config.params.pageIndex) {
        config.params.pageIndex = Number(config.params.pageIndex) - 1;
      }

      return config;
    });
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
