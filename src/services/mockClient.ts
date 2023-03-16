import axios, { AxiosInstance } from 'axios';

/**
 * Mocked backend client. Use for WIP features.
 */
class MockClient {
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

export const mockClient = new MockClient();
