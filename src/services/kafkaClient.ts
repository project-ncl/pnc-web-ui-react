import axios, { AxiosInstance } from 'axios';

import * as webConfigService from './webConfigService';

/**
 * Utils class managing http client instance, only one instance is created.
 */
class KafkaClient {
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
      baseURL: webConfigService.getKafkaUrl(),
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

export const kafkaClient = new KafkaClient();
