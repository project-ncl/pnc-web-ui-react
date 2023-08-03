import { AxiosRequestConfig } from 'axios';

import {
  ArtifactPage,
  BuildPage,
  DeliverableAnalyzerOperationPage,
  ProductMilestone,
  ProductMilestoneCloseResultPage,
} from 'pnc-api-types-ts';

import { pncApiMocksClient } from 'services/pncApiMocksClient';

import { pncClient } from './pncClient';

interface IProductMilestoneApiData {
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
 * Gets Product Milestone Delivered Artifacts.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getDeliveredArtifacts = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/product-milestones/${id}/delivered-artifacts`, requestConfig);
};

/*
 * Gets Product Milestone Deliverables Analysis.
 *
 * @param requestConfig - Axios based request config
 */
export const getDeliverablesAnalysis = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient
    .getHttpClient()
    .get<DeliverableAnalyzerOperationPage>(`/product-milestones/${id}/deliverables-analyzer-operations`, requestConfig);
};

/**
 * Gets Product Milestone Close Results.
 *
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
 * @param requestConfig - Axios based request config
 */
export const getStatistics = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<any>(`/product-milestones/${id}/statistics`, requestConfig);
};

/**
 * Gets Product Milestone interconnection graph.
 *
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

/**
 * Gets Product Milestone Comparison table.
 *
 * @param serviceData - object containing:
 *  - data.productMilestones - array of Product Milestone ids
 * @param requestConfig - Axios based request config
 */
export const getProductMilestoneComparison = (
  { data }: { data: { productMilestones: string[] } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncApiMocksClient.getHttpClient().post<any>(`/product-milestone-comparison`, data, requestConfig);
};
