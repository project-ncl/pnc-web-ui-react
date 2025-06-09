import { AxiosRequestConfig } from 'axios';

import { BuildPushOperation, DeliverableAnalyzerOperation, DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { pncClient } from './pncClient';

interface IDeliverableAnalysisApiData {
  id: string;
}

/**
 * Gets all Deliverable Analyses operations.
 *
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalyses = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerOperationPage>('/operations/deliverable-analyzer', requestConfig);
};

/**
 * Gets a Deliverable Analysis operation.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalysis = ({ id }: IDeliverableAnalysisApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerOperation>(`/operations/deliverable-analyzer/${id}`, requestConfig);
};

/**
 * Analyzes Deliverables.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 *  - data - list of Deliverable Analysis URLs
 * @param requestConfig - Axios based request config
 */
export const analyzeDeliverables = (
  { id, data }: { id?: string; data: { deliverablesUrls: string[]; runAsScratchAnalysis: boolean } },
  requestConfig: AxiosRequestConfig = {}
) => {
  if (id) {
    return productMilestoneApi.analyzeDeliverables({ id, data });
  }

  return pncClient.getHttpClient().post<any>(`/operations/deliverable-analyzer/start`, data, requestConfig);
};

interface IBuildPushApiData {
  id: string;
}

/**
 * Gets a Build Push operation.
 *
 * @param serviceData - object containing:
 *  - id - Build Push ID
 * @param requestConfig - Axios based request config
 */
export const getBuildPush = ({ id }: IBuildPushApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPushOperation>(`/operations/build-pushes/${id}`, requestConfig);
};
