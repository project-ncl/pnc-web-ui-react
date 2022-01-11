import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import buildsRequestMock from './builds-mock.json';
import projectsRequestMock from './projects-mock.json';
import projectRequestMock from './project-mock.json';

let mockAdapter = new MockAdapter(axios);

class PncClientMock {
  private httpClient: AxiosInstance;

  constructor() {
    this.loadAxiosMock();
    this.httpClient = axios;
  }

  private loadAxiosMock = async () => {
    mockAdapter.onGet('/projects').reply(200, projectsRequestMock);
    mockAdapter.onGet(/\/projects\/\d+$/).reply(200, projectRequestMock);
    mockAdapter.onGet(/\/projects\/\d+\/builds$/).reply(200, buildsRequestMock);
  };

  // PUBLIC

  public getHttpClient(): AxiosInstance {
    return this.httpClient;
  }
}

export const pncClient = new PncClientMock();
