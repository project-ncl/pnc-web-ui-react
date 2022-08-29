import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { Project } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IProjectServiceData {
  id: string;
}

class ProjectService {
  /**
   * Gets all Projects.
   *
   * @param requestConfig - Axios based request config
   * @returns Projects
   */
  public getProjects(requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get('/projects', requestConfig);
  }

  /**
   * Gets a specific Project.
   *
   * @param data - object containing ID of the Project
   * @param requestConfig - Axios based request config
   * @returns Project
   */
  public getProject({ id }: IProjectServiceData, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`/projects/${id}`, requestConfig);
  }

  /**
   * Creates a new Project.
   *
   * @param data - object containing new Project data
   * @param requestConfig  - Axios based request config
   * @returns Created Project
   */
  public createProject(data: Omit<Project, 'id'>, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().post('/projects', data, requestConfig);
  }

  /**
   * Patch a Project.
   *
   * @param id - project ID
   * @param patch - array of changes in JSON patch format
   * @param requestConfig - Axios based request config
   * @returns Updated Project
   */
  public patchProject(id: string, patch: Operation[], requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().patch(`/projects/${id}`, patch, requestConfig);
  }

  /**
   * Gets all builds associated with a specific project.
   *
   * @param data - object containing ID of the Project
   * @param requestConfig - Axios based request config
   * @returns Builds
   */
  public getProjectBuilds({ id }: IProjectServiceData, requestConfig: AxiosRequestConfig = {}) {
    return pncClient.getHttpClient().get(`/projects/${id}/builds`, requestConfig);
  }
}

/**
 * Instance of ProjectService providing group of Project related API operations.
 */
export const projectService = new ProjectService();
