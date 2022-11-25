import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { Project } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IProjectApiData {
  id: string;
}

/**
 * Gets all Projects.
 *
 * @param requestConfig - Axios based request config
 * @returns Projects
 */
export const getProjects = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/projects', requestConfig);
};

/**
 * Gets a specific Project.
 *
 * @param data - object containing ID of the Project
 * @param requestConfig - Axios based request config
 * @returns Project
 */
export const getProject = ({ id }: IProjectApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get(`/projects/${id}`, requestConfig);
};

/**
 * Creates a new Project.
 *
 * @param data - object containing new Project data
 * @param requestConfig  - Axios based request config
 * @returns Created Project
 */
export const createProject = (data: Omit<Project, 'id'>, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post('/projects', data, requestConfig);
};

/**
 * Patch a Project.
 *
 * @param id - project ID
 * @param patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 * @returns Updated Project
 */
export const patchProject = (id: string, patchData: Operation[], requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().patch(`/projects/${id}`, patchData, requestConfig);
};

/**
 * Gets all builds associated with a specific project.
 *
 * @param data - object containing ID of the Project
 * @param requestConfig - Axios based request config
 * @returns Builds
 */
export const getProjectBuilds = ({ id }: IProjectApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get(`/projects/${id}/builds`, requestConfig);
};
