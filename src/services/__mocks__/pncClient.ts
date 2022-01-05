import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import buildsRequestMock from './builds-mock.json';
import projectsRequestMock from './projects-mock.json';
import projectRequestMock from './project-mock.json';

let mock = new MockAdapter(axios);

class ClientMock {
  private httpClient: AxiosInstance;

  constructor() {
    this.loadAxiosMock();
    this.httpClient = axios;
  }

  private loadAxiosMock = async () => {
    mock.onGet('/projects').reply(200, projectsRequestMock);
    mock.onGet(/\/projects\/\d+$/).reply(200, projectRequestMock);
    mock.onGet(/\/projects\/\d+\/builds$/).reply(200, buildsRequestMock);
  };

  // PUBLIC

  public getHttpClient(): AxiosInstance {
    return this.httpClient;
  }
}

export const pncClient = new ClientMock();
