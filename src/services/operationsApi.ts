import { AxiosRequestConfig } from 'axios';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IDeliverablesAnalysisApiData {
  id: string;
}

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
