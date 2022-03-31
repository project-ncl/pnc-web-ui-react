import { AxiosRequestConfig } from 'axios';
import { pncClient } from './pncClient';

export interface IProjectServiceData {
  id: string;
}

class ProjectService {
  path = '/projects';

  /**
   * Gets all Projects.
   *
   * @param requestConfig - Axios based request config
   * @returns Projects
   */
  public getProjects(requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(this.path, requestConfig);
  }

  /**
   * Gets a specific Project.
   *
   * @param data - object containing ID of the Project
   * @param requestConfig - Axios based request config
   * @returns Project
   */
  public getProject({ id }: IProjectServiceData, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`${this.path}/${id}`, requestConfig);
  }

  /**
   * Gets all builds associated with a specific project.
   *
   * @param data - object containing ID of the Project
   * @param requestConfig - Axios based request config
   * @returns Builds
   */
  public getProjectBuilds({ id }: IProjectServiceData, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`${this.path}/${id}/builds`, requestConfig);
  }
}

/**
 * Instance of ProjectService providing group of Project related API operations.
 */
export const projectService = new ProjectService();
