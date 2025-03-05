import { AxiosRequestConfig } from 'axios';

import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { pncClient } from 'services/pncClient';

interface IDeliverableAnalysisReportApiData {
  id: string;
}

/**
 * Gets a Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalysisReport = (
  { id }: IDeliverableAnalysisReportApiData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerReport>(`/deliverable-analyses/${id}`, requestConfig);
};
