import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import {
  ArtifactPage,
  BuildPage,
  BuildPushOperationPage,
  DeliverableAnalyzerOperationPage,
  DeliveredArtifactInMilestones,
  ProductMilestone,
  ProductVersion,
} from 'pnc-api-types-ts';

import * as productVersionApi from 'services/productVersionApi';

import { extendRequestConfig } from 'utils/requestConfigHelper';

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
 * Gets Product Milestone Deliverable Analyses.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalyses = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient
    .getHttpClient()
    .get<DeliverableAnalyzerOperationPage>(`/product-milestones/${id}/deliverables-analyzer-operations`, requestConfig);
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
 * Gets Build Push operations of the Builds pushed on Milestone close.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getBuildPushes = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPushOperationPage>(`/product-milestones/${id}/build-push-operations`, requestConfig);
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

type ProductMilestoneWithFullVersion = Omit<ProductMilestone, 'productVersion'> & {
  productVersion: ProductVersion;
};

interface VertexProductMilestone {
  data?: ProductMilestoneWithFullVersion;
  dataType?: string;
  name?: string;
}

interface EdgeProductMilestone {
  cost?: number;
  source?: string;
  target?: string;
}

// TODO (NCL-9075): import types from pnc-api-types-ts once upgraded
export interface GraphProductMilestone {
  edges?: EdgeProductMilestone[];
  vertices?: {
    [name: string]: VertexProductMilestone;
  };
}

export const MAX_INTERCONNECTION_GRAPH_DEPTH = 5;

/**
 * Gets Product Milestone interconnection graph.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * - depthLimit - Maximum depth of a graph from the node belonging to Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getInterconnectionGraph = async (
  { id, depthLimit = MAX_INTERCONNECTION_GRAPH_DEPTH }: { id: string; depthLimit?: number },
  requestConfig: AxiosRequestConfig = {}
) => {
  const graph = await pncClient.getHttpClient().get<GraphProductMilestone>(
    `/product-milestones/${id}/interconnection-graph`,
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        depthLimit: depthLimit,
      },
    })
  );

  const graphVertices = graph.data.vertices;
  const productVersionIds = Array.from(
    new Set(
      Object.values(graphVertices!)
        .map((vertex) => vertex.data!.productVersion!.id!)
        .filter(Boolean)
    )
  );

  const productVersionMap = Object.fromEntries(
    await Promise.all(
      productVersionIds.map(async (id): Promise<[string, ProductVersion]> => {
        const productVersion = await productVersionApi.getProductVersion({ id });
        return [id, productVersion.data];
      })
    )
  );

  for (const vertex of Object.values(graphVertices!)) {
    const productVersionId = vertex.data!.productVersion!.id;
    const productVersion = productVersionId && productVersionMap[productVersionId];
    if (productVersion) {
      vertex.data!.productVersion = productVersion;
    }
  }

  return graph;
};

/**
 * Gets shared Delivered Artifacts between Product Milestones.
 *
 * @param requestConfig - Axios based request config
 */
export const getSharedDeliveredArtifacts = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/product-milestones/delivered-artifacts/shared`, requestConfig);
};

export interface IProductMilestoneComparisonData {
  productMilestoneIds: string[];
}

/**
 * Gets Product Milestone Comparison table.
 *
 * @param serviceData - object containing:
 *  - data.productMilestones - array of Product Milestone ids
 * @param requestConfig - Axios based request config
 */
export const getProductMilestoneComparison = (
  { productMilestoneIds }: IProductMilestoneComparisonData,
  requestConfig: AxiosRequestConfig = {}
) => {
  const productMilestoneIdsQuery = productMilestoneIds.map((id) => `milestoneIds=${id}`).join('&');

  return pncClient
    .getHttpClient()
    .get<DeliveredArtifactInMilestones[]>(
      `/product-milestones/comparisons/delivered-artifacts?${productMilestoneIdsQuery}`,
      requestConfig
    );
};

/**
 * Closes a Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const closeProductMilestone = (
  { id, data }: { id: string; data: { skipBrewPush: boolean } },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().post<undefined>(`/product-milestones/${id}/close`, data, requestConfig);
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
