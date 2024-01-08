import { AxiosRequestConfig } from 'axios';

import { bifrostClient } from 'services/bifrostClient';
import { dependencyAnalyzerClient } from 'services/dependencyAnalyzerClient';
import { kafkaClient } from 'services/kafkaClient';
import { pncClient } from 'services/pncClient';
import { repourClient } from 'services/repourClient';
import { uiLoggerClient } from 'services/uiLoggerClient';

interface ComponentVersion {
  name: string;
  version: string;
  commit: string;
  builtOn: string;
}

/**
 * Gets version of PNC.
 *
 * @param requestConfig - Axios based request config
 */
export const getPncVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Kafka.
 *
 * @param requestConfig - Axios based request config
 */
export const getKafkaVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return kafkaClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of UI Logger.
 *
 * @param requestConfig - Axios based request config
 */
export const getUiLoggerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return uiLoggerClient.getHttpClient().get<ComponentVersion>('/rest/version', requestConfig);
};

/**
 * Gets version of Repour.
 *
 * @param requestConfig - Axios based request config
 */
export const getRepourVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return repourClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Bifrost.
 *
 * @param requestConfig - Axios based request config
 */
export const getBifrostVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return bifrostClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Dependency Analyzer.
 *
 * @param requestConfig - Axios based request config
 */
export const getDependencyAnalyzerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return dependencyAnalyzerClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};
