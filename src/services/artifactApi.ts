import { AxiosRequestConfig } from 'axios';

import { Artifact, ArtifactPage, ArtifactRevisionPage, BuildPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

export interface IArtifactApiData {
  id: string;
}

/**
 * Gets all Artifacts.
 *
 * @param requestConfig - Axios based request config
 */
export const getArtifacts = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>('/artifacts', requestConfig);
};

/**
 * Gets a specific Artifact.
 *
 * @param serviceData - object containing:
 *  - id - Artifact ID
 * @param requestConfig - Axios based request config
 */
export const getArtifact = ({ id }: IArtifactApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<Artifact>(`/artifacts/${id}`, requestConfig);
};

/**
 * Gets Quality Revisions of an Artifact.
 *
 * @param serviceData - object containing:
 *  - id - Artifact ID
 * @param requestConfig - Axios based request config
 */
export const getQualityRevisions = ({ id }: IArtifactApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactRevisionPage>(`/artifacts/${id}/revisions`, requestConfig);
};

/**
 * Gets dependant Builds of an Artifact..
 *
 * @param requestConfig - Axios based request config
 */
export const getDependantBuilds = ({ id }: IArtifactApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/artifacts/${id}/dependant-builds`, requestConfig);
};
