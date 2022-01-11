import axios, { AxiosInstance } from 'axios';
import * as WebConfigAPI from './WebConfigService';

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
      console.log('axios request interceptor');
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
