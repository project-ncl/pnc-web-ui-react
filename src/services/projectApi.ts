import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { BuildPage, Project, ProjectPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IProjectApiData {
  id: string;
}

/**
 * Gets all Projects.
 *
 * @param requestConfig - Axios based request config
 */
export const getProjects = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProjectPage>('/projects', requestConfig);
};

/**
 * Gets a specific Project.
 *
 * @param serviceData - object containing:
 *  - id - Project ID
 * @param requestConfig - Axios based request config
 */
export const getProject = ({ id }: IProjectApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Project>(`/projects/${id}`, requestConfig);
};

/**
 * Creates a new Project.
 *
 * @param data - object containing new Project data
 * @param requestConfig - Axios based request config
 */
export const createProject = ({ data }: { data: Omit<Project, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<Project>('/projects', data, requestConfig);
};

/**
 * Patch a Project.
 *
 * @param serviceData - object containing:
 *  - id - project ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchProject = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<Project>(`/projects/${id}`, patchData, requestConfig);
};

/**
 * Gets all builds associated with a specific project.
 *
 * @param serviceData - object containing:
 *  - id - Project ID
 * @param requestConfig - Axios based request config
 */
export const getProjectBuilds = ({ id }: IProjectApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/projects/${id}/builds`, requestConfig);
};
