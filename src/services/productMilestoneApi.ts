import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import {
  ArtifactPage,
  BuildPage,
  DeliverableAnalyzerOperationPage,
  ProductMilestone,
  ProductMilestoneCloseResult,
  ProductMilestoneCloseResultPage,
} from 'pnc-api-types-ts';

import { pncApiMocksClient } from 'services/pncApiMocksClient';

import { pncClient } from './pncClient';

export interface IProductMilestoneApiData {
  id: string;
}

/**
 * Gets a specific Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getProductMilestone = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductMilestone>(`/product-milestones/${id}`, requestConfig);
};

/**
 * Creates a new Product Milestone.
 *
 * @param data - object containing new Product Milestone data
 * @param requestConfig - Axios based request config
 */
export const createProductMilestone = (
  { data }: { data: Omit<ProductMilestone, 'id'> },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<ProductMilestone>('/product-milestones', data, requestConfig);
};

/**
 * Patches a Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchProductMilestone = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<ProductMilestone>(`/product-milestones/${id}`, patchData, requestConfig);
};

/**
 * Gets Product Milestone Delivered Artifacts.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getDeliveredArtifacts = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/product-milestones/${id}/delivered-artifacts`, requestConfig);
};

/**
 * Gets Product Milestone Deliverables Analyses.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverablesAnalyses = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient
    .getHttpClient()
    .get<DeliverableAnalyzerOperationPage>(`/product-milestones/${id}/deliverables-analyzer-operations`, requestConfig);
};

/**
 * Gets Product Milestone Close Results.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getCloseResults = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductMilestoneCloseResultPage>(`/product-milestones/${id}/close-results`, requestConfig);
};

/**
 * Gets Builds performed during a Product Milestone cycle.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getBuilds = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/product-milestones/${id}/builds`, requestConfig);
};

/**
 * Gets Product Milestone statistics.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getStatistics = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<any>(`/product-milestones/${id}/statistics`, requestConfig);
};

/**
 * Gets Product Milestone interconnection graph.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getInterconnectionGraph = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncApiMocksClient.getHttpClient().get<any>(`/product-milestones/${id}/interconnection-graph`, requestConfig);
};

/**
 * Gets shared Delivered Artifacts between Product Milestones.
 *
 * @param requestConfig - Axios based request config
 */
export const getSharedDeliveredArtifacts = (requestConfig: AxiosRequestConfig = {}) => {
  return pncApiMocksClient.getHttpClient().get<any>(`/product-milestone-shared-delivered-artifacts`, requestConfig);
};

export interface IProductMilestoneComparisonData {
  data: { productMilestones: string[] };
}

/**
 * Gets Product Milestone Comparison table.
 *
 * @param serviceData - object containing:
 *  - data.productMilestones - array of Product Milestone ids
 * @param requestConfig - Axios based request config
 */
export const getProductMilestoneComparison = (
  { data }: IProductMilestoneComparisonData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncApiMocksClient.getHttpClient().post<any>(`/product-milestone-comparison`, data, requestConfig);
};

/**
 * Closes a Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const closeProductMilestone = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<ProductMilestoneCloseResult>(`/product-milestones/${id}/close`, undefined, requestConfig);
};

/**
 * Analyzes Deliverables.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 *  - data - list of Deliverables Analysis URLs
 * @param requestConfig - Axios based request config
 */
export const analyzeDeliverables = (
  { id, data }: { id: string; data: { deliverablesUrls: string[]; runAsScratchAnalysis: boolean } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<any>(`/product-milestones/${id}/analyze-deliverables`, data, requestConfig);
};

/**
 * Validates a version of a Product Milestone.
 *
 * @param serviceData - object containing:
 *  - data.productVersionId - ID of a Product Version of the Product Milestone
 *  - data.version - Product Milestone version to be validated
 * @param requestConfig - Axios based request config
 */
export const validateProductMilestoneVersion = (
  { data }: { data: { productVersionId: string; version: string } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<any>(`/product-milestones/validate-version`, data, requestConfig);
};
