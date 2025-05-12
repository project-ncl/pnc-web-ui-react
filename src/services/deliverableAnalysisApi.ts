import { AxiosRequestConfig } from 'axios';

import { AnalyzedArtifactPage, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { DeliverableAnalysisLabel } from 'common/deliverableAnalysisLabelEntryEntityAttributes';

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

interface IDeliverableAnalysisReportEditLabelApiData {
  id: string;
  data: { label: DeliverableAnalysisLabel; reason: string };
}

/**
 * Adds a label to the Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 *  - data - label and the reason for the change
 * @param requestConfig - Axios based request config
 */
export const addDeliverableAnalysisLabel = (
  { id, data }: IDeliverableAnalysisReportEditLabelApiData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<undefined>(`/deliverable-analyses/${id}/add-label`, data, requestConfig);
};

/**
 * Removes a label from the Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 *  - data - label and the reason for the change
 * @param requestConfig - Axios based request config
 */
export const removeDeliverableAnalysisLabel = (
  { id, data }: IDeliverableAnalysisReportEditLabelApiData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<undefined>(`/deliverable-analyses/${id}/remove-label`, data, requestConfig);
};

/**
 * Gets analyzed artifacts of a Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getAnalyzedArtifacts = ({ id }: IDeliverableAnalysisReportApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<AnalyzedArtifactPage>(`/deliverable-analyses/${id}/analyzed-artifacts`, requestConfig);
};
