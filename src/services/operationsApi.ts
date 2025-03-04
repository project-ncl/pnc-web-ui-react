import { AxiosRequestConfig } from 'axios';

import { DeliverableAnalyzerOperation, DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

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
