import { AxiosRequestConfig } from 'axios';

import { DeliverableAnalyzerOperation, DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IDeliverablesAnalysisApiData {
  id: string;
}
/**
 * Gets all Deliverables Analyses.
 *
 * @param requestConfig - Axios based request config
 */
export const getDeliverablesAnalyses = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerOperationPage>('/operations/deliverable-analyzer', requestConfig);
};

/**
 * Gets a Deliverables Analysis.
 *
 * @param serviceData - object containing:
 *  - id - Deliverables Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverablesAnalysis = ({ id }: IDeliverablesAnalysisApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerOperation>(`/operations/deliverable-analyzer/${id}`, requestConfig);
};

/**
 * Analyzes Deliverables (Milestone-less variant).
 *
 * @param serviceData - object containing:
 *  - data - list of Deliverables Analysis URLs
 * @param requestConfig - Axios based request config
 */
export const analyzeDeliverables = (
  { data }: { data: { deliverablesUrls: string[] } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<any>('/operations/deliverable-analyzer/start', data, requestConfig);
};
