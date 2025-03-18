import { AxiosRequestConfig } from 'axios';

import { DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { AssignableDeliverableAnalysisLabel } from 'common/deliverableAnalysisLabelEntryEntityAttributes';

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

export const addDeliverableAnalysisLabel = (
  { id, data }: { id: string; data: { label: AssignableDeliverableAnalysisLabel; reason: string } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<undefined>(`/deliverable-analyses/${id}/add-label`, data, requestConfig);
};
