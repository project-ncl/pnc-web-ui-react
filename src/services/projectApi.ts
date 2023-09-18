import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import { BuildConfigPage, BuildPage, Project, ProjectPage } from 'pnc-api-types-ts';

import { addQParamItem } from 'utils/qParamHelper';

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

/**
 * Gets all Build Configs of a Project with the latest Build.
 *
 * @param serviceData - object containing:
 *  - id - Project ID
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = ({ id }: IProjectApiData, requestConfig: AxiosRequestConfig = {}) => {
  const qParam = addQParamItem('project.id', id, '==', requestConfig?.params?.q ? requestConfig.params.q : '');
  const newRequestConfig = { ...requestConfig, params: { ...requestConfig.params, q: qParam } };
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', newRequestConfig);
};
