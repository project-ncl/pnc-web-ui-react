import axios, { AxiosInstance } from 'axios';

/**
 * Utils class managing http client instance, only one instance is created.
 */
class MockBackendClient {
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
      baseURL: `http://localhost:8020`,
    });

  // PUBLIC

  /**
   * @returns Axios instance
   */
  public getHttpClient = (): AxiosInstance => this.httpClient;
}

export const mockBackendClient = new MockBackendClient();
