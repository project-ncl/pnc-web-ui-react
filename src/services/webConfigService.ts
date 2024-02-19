// extend the global Window interface
declare global {
  interface Window {
    pnc?: any;
  }
}

export interface IWebConfigGrafana {
  trafficLightsUrl: string;
  statusMapUrl: string;
}

export interface IWebConfigKeycloak {
  url: string;
  realm: string;
  clientId: string;
}

export interface IWebConfig {
  bpmUrl: string;
  cartographerUrl: string;
  daUrl: string;
  indyUrl: string;
  pncUrl: string;
  repourUrl: string;
  externalBifrostUrl: string;
  externalBuildDriverUrl: string;
  externalCleanerUrl: string;
  externalDaUrl: string;
  externalDeliverablesAnalyzerUrl: string;
  externalEnvironmentDriverUrl: string;
  externalCausewayUrl: string;
  externalIndyUrl: string;
  externalKafkaStoreUrl: string;
  externalLogEventDurationUrl: string;
  externalPncUrl: string;
  externalRepositoryDriverUrl: string;
  externalRepourUrl: string;
  externalRexUrl: string;
  externalSbomerUrl: string;
  externalEttUrl: string;
  externalUiLoggerUrl: string;
  brewContentUrl: string;
  pncNotificationsUrl: string;
  bifrostWsUrl: string;
  userGuideUrl: string;
  ssoTokenLifespan: number;
  keycloak: IWebConfigKeycloak;
  grafana: IWebConfigGrafana;
  internalScmAuthority: string;
}

export interface IPncConfig {
  config: IWebConfig;
}

/**
 * Return PNC Web Configuration data coming from Orchestrator
 */
export const getPncConfig = (): IPncConfig => {
  // window.pnc object is loaded in public/index.html from Orchestrator
  const pncConfig = window.pnc;

  if (!pncConfig) {
    throw new Error(
      `PNC Config does not contain any data, check whether internal network resources are reachable: #${pncConfig}#`
    );
  }

  return pncConfig;
};

export const getWebConfig = (): IWebConfig => {
  const webConfig = getPncConfig().config;

  if (!webConfig) {
    throw new Error(`Web Config doesn't content required "config" property: #${webConfig}#`);
  }
  return webConfig;
};

/**
 * Return PNC URL endpoint
 */
export const getPncUrl = (): string => {
  const pncUrl = getWebConfig().externalPncUrl;

  if (!pncUrl) {
    throw new Error(`PNC URL does not contain any data: #${pncUrl}#`);
  }
  return pncUrl;
};

/**
 * Return PNC Notifications URL endpoint
 */
export const getPncNotificationsUrl = (): string => {
  const pncNotificationsUrl = getWebConfig().pncNotificationsUrl;

  if (!pncNotificationsUrl) {
    throw new Error(`PNC Notifications URL does not contain any data: #${pncNotificationsUrl}#`);
  }
  return pncNotificationsUrl;
};

/**
 * Return Kafka URL endpoint
 */
export const getKafkaUrl = (): string => {
  const kafkaUrl = getWebConfig().externalKafkaStoreUrl;

  if (!kafkaUrl) {
    throw new Error(`Kafka URL does not contain any data: #${kafkaUrl}#`);
  }
  return kafkaUrl;
};

/**
 * Return Causeway URL endpoint
 */
export const getCausewayUrl = (): string => {
  const causewayUrl = getWebConfig().externalCausewayUrl;

  if (!causewayUrl) {
    throw new Error(`Causeway URL does not contain any data: #${causewayUrl}#`);
  }
  return causewayUrl;
};

export const getPncApiMocksUrl = (): string => {
  // TODO: extract URL from config once available
  const pncApiMocksUrl = process.env.REACT_APP_PNC_API_MOCKS_URL;

  if (!pncApiMocksUrl) {
    throw new Error(`PNC API MOCKS URL does not contain any data: #${pncApiMocksUrl}#`);
  }

  return pncApiMocksUrl;
};

export const getUILoggerUrl = (): string => {
  const uiLoggerUrl = getWebConfig().externalUiLoggerUrl;

  if (!uiLoggerUrl) {
    throw new Error(`UI Logger URL does not contain any data: #${uiLoggerUrl}#`);
  }

  return uiLoggerUrl;
};

export const getRepourUrl = (): string => {
  const repourUrl = getWebConfig().externalRepourUrl;

  if (!repourUrl) {
    throw new Error(`Repour URL does not contain any data: #${repourUrl}#`);
  }

  return repourUrl;
};

export const getBifrostUrl = (): string => {
  const bifrostUrl = getWebConfig().externalBifrostUrl;

  if (!bifrostUrl) {
    throw new Error(`Bifrost URL does not contain any data: #${bifrostUrl}#`);
  }

  return bifrostUrl;
};

export const getDependencyAnalyzerUrl = (): string => {
  const dependencyAnalyzerUrl = getWebConfig().externalDaUrl;

  if (!dependencyAnalyzerUrl) {
    throw new Error(`Dependency Analyzer URL does not contain any data: #${dependencyAnalyzerUrl}#`);
  }

  return dependencyAnalyzerUrl;
};

export const getBuildDriverUrl = (): string => {
  const buildDriverUrl = getWebConfig().externalBuildDriverUrl;

  if (!buildDriverUrl) {
    throw new Error(`Build Driver URL does not contain any data: #${buildDriverUrl}#`);
  }

  return buildDriverUrl;
};

export const getCleanerUrl = (): string => {
  const cleanerUrl = getWebConfig().externalCleanerUrl;

  if (!cleanerUrl) {
    throw new Error(`Cleaner URL does not contain any data: #${cleanerUrl}#`);
  }

  return cleanerUrl;
};

export const getDeliverablesAnalyzerUrl = (): string => {
  const deliverablesAnalyzerUrl = getWebConfig().externalDeliverablesAnalyzerUrl;

  if (!deliverablesAnalyzerUrl) {
    throw new Error(`Deliverables Analyzer URL does not contain any data: #${deliverablesAnalyzerUrl}#`);
  }

  return deliverablesAnalyzerUrl;
};

export const getEnvironmentDriverUrl = (): string => {
  const environmentDriverUrl = getWebConfig().externalEnvironmentDriverUrl;

  if (!environmentDriverUrl) {
    throw new Error(`Environment Driver URL does not contain any data: #${environmentDriverUrl}#`);
  }

  return environmentDriverUrl;
};
