import { AxiosRequestConfig } from 'axios';

import { bifrostClient } from 'services/bifrostClient';
import { buildDriverClient } from 'services/buildDriverClient';
import { causewayClient } from 'services/causewayClient';
import { cleanerClient } from 'services/cleanerClient';
import { deliverableAnalyzerClient } from 'services/deliverableAnalyzerClient';
import { dependencyAnalyzerClient } from 'services/dependencyAnalyzerClient';
import { environmentDriverClient } from 'services/environmentDriverClient';
import { ettClient } from 'services/ettClient';
import { kafkaClient } from 'services/kafkaClient';
import { logEventDurationClient } from 'services/logEventDurationClient';
import { pncClient } from 'services/pncClient';
import { repositoryDriverClient } from 'services/repositoryDriverClient';
import { repourClient } from 'services/repourClient';
import { rexClient } from 'services/rexClient';
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
 * Gets version of Causeway.
 *
 * @param requestConfig - Axios based request config
 */
export const getCausewayVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = causewayClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
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
  const result = repourClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Bifrost.
 *
 * @param requestConfig - Axios based request config
 */
export const getBifrostVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = bifrostClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Dependency Analyzer.
 *
 * @param requestConfig - Axios based request config
 */
export const getDependencyAnalyzerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = dependencyAnalyzerClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Build Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = buildDriverClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Cleaner.
 *
 * @param requestConfig - Axios based request config
 */
export const getCleanerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = cleanerClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Deliverable Analyzer.
 *
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalyzerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = deliverableAnalyzerClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/api/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Environment Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getEnvironmentDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = environmentDriverClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Log Event Duration.
 *
 * @param requestConfig - Axios based request config
 */
export const getLogEventDurationVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = logEventDurationClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Repository Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getRepositoryDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = repositoryDriverClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of Rex.
 *
 * @param requestConfig - Axios based request config
 */
export const getRexVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = rexClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/rest/version', requestConfig) : Promise.reject(result.error);
};

/**
 * Gets version of ETT.
 *
 * @param requestConfig - Axios based request config
 */
export const getEttVersion = (requestConfig: AxiosRequestConfig = {}) => {
  const result = ettClient.getHttpClient();

  return result.success ? result.value.get<ComponentVersion>('/rest/version', requestConfig) : Promise.reject(result.error);
};
