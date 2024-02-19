import { AxiosRequestConfig } from 'axios';

import { bifrostClient } from 'services/bifrostClient';
import { buildDriverClient } from 'services/buildDriverClient';
import { causewayClient } from 'services/causewayClient';
import { cleanerClient } from 'services/cleanerClient';
import { deliverablesAnalyzerClient } from 'services/deliverablesAnalyzerClient';
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
  return causewayClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
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

/**
 * Gets version of Build Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return buildDriverClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Cleaner.
 *
 * @param requestConfig - Axios based request config
 */
export const getCleanerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return cleanerClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Deliverables Analyzer.
 *
 * @param requestConfig - Axios based request config
 */
export const getDeliverablesAnalyzerVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return deliverablesAnalyzerClient.getHttpClient().get<ComponentVersion>('/api/version', requestConfig);
};

/**
 * Gets version of Environment Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getEnvironmentDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return environmentDriverClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Log Event Duration.
 *
 * @param requestConfig - Axios based request config
 */
export const getLogEventDurationVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return logEventDurationClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Repository Driver.
 *
 * @param requestConfig - Axios based request config
 */
export const getRepositoryDriverVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return repositoryDriverClient.getHttpClient().get<ComponentVersion>('/version', requestConfig);
};

/**
 * Gets version of Rex.
 *
 * @param requestConfig - Axios based request config
 */
export const getRexVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return rexClient.getHttpClient().get<ComponentVersion>('/rest/version', requestConfig);
};

/**
 * Gets version of ETT.
 *
 * @param requestConfig - Axios based request config
 */
export const getEttVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return ettClient.getHttpClient().get<ComponentVersion>('/rest/version', requestConfig);
};
