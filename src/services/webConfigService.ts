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
  reqourUrl: string;
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
  externalReqourUrl: string;
  externalRexUrl: string;
  externalSbomerUrl: string;
  externalEttUrl: string;
  externalUiLoggerUrl: string;
  externalDingroguUrl: string;
  brewContentUrl: string;
  pncNotificationsUrl: string;
  bifrostWsUrl: string;
  userGuideUrl: string;
  userSupportUrl: string;
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
 * Return PNC endpoint URL
 */
export const getPncUrl = (): string => {
  const pncUrl = getWebConfig().externalPncUrl;

  if (!pncUrl) {
    throw new Error(`PNC URL does not contain any data: #${pncUrl}#`);
  }
  return pncUrl;
};

/**
 * Return PNC Notifications endpoint URL
 */
export const getPncNotificationsUrl = (): string => {
  const pncNotificationsUrl = getWebConfig().pncNotificationsUrl;

  if (!pncNotificationsUrl) {
    throw new Error(`PNC Notifications URL does not contain any data: #${pncNotificationsUrl}#`);
  }
  return pncNotificationsUrl;
};

/**
 * Return PNC Bifrost WebSocket endpoint URL
 */
export const getBifrostWsUrl = (): string => {
  const bifrostWsUrl = getWebConfig().bifrostWsUrl;

  if (!bifrostWsUrl) {
    throw new Error(`Bifrost WebSocket URL does not contain any data: #${bifrostWsUrl}#`);
  }
  return bifrostWsUrl;
};

/**
 * Return UI logger endpoint
 */
export const getUILoggerUrl = (): string => {
  const uiLoggerUrl = getWebConfig().externalUiLoggerUrl;

  if (!uiLoggerUrl) {
    throw new Error(`UI Logger URL does not contain any data: #${uiLoggerUrl}#`);
  }

  return uiLoggerUrl;
};

/**
 * Return PNC API mocks endpoint URL
 */
export const getPncApiMocksUrl = (): string => {
  // TODO: extract URL from config once available
  const pncApiMocksUrl = import.meta.env.VITE_PNC_API_MOCKS_URL;

  if (!pncApiMocksUrl) {
    throw new Error(`PNC API MOCKS URL does not contain any data: #${pncApiMocksUrl}#`);
  }

  return pncApiMocksUrl;
};

/**
 * Return Kafka endpoint URL
 */
export const getKafkaUrl = (): string => {
  const kafkaUrl = getWebConfig().externalKafkaStoreUrl;

  if (!kafkaUrl) {
    throw new Error(`Kafka URL does not contain any data: #${kafkaUrl}#`);
  }
  return kafkaUrl;
};

/**
 * Return Causeway endpoint URL
 */
export const getCausewayUrl = (): string | null => {
  const causewayUrl = getWebConfig().externalCausewayUrl;

  if (!causewayUrl) {
    return null;
  }
  return causewayUrl;
};

/**
 * Return Reqour endpoint URL
 */
export const getReqourUrl = (): string | null => {
  const reqourUrl = getWebConfig().externalReqourUrl;

  if (!reqourUrl) {
    return null;
  }

  return reqourUrl;
};

/**
 * Return Bifrost endpoint URL
 */
export const getBifrostUrl = (): string | null => {
  const bifrostUrl = getWebConfig().externalBifrostUrl;

  if (!bifrostUrl) {
    return null;
  }

  return bifrostUrl;
};

/**
 * Return Dependency Analyzer endpoint URL
 */
export const getDependencyAnalyzerUrl = (): string | null => {
  const dependencyAnalyzerUrl = getWebConfig().externalDaUrl;

  if (!dependencyAnalyzerUrl) {
    return null;
  }

  return dependencyAnalyzerUrl;
};

/**
 * Return Build Driver endpoint URL
 */
export const getBuildDriverUrl = (): string | null => {
  const buildDriverUrl = getWebConfig().externalBuildDriverUrl;

  if (!buildDriverUrl) {
    return null;
  }

  return buildDriverUrl;
};

/**
 * Return Cleaner endpoint URL
 */
export const getCleanerUrl = (): string | null => {
  const cleanerUrl = getWebConfig().externalCleanerUrl;

  if (!cleanerUrl) {
    return null;
  }

  return cleanerUrl;
};

/**
 * Return Deliverable Analyzer endpoint URL
 */
export const getDeliverableAnalyzerUrl = (): string | null => {
  const deliverableAnalyzerUrl = getWebConfig().externalDeliverablesAnalyzerUrl;

  if (!deliverableAnalyzerUrl) {
    return null;
  }

  return deliverableAnalyzerUrl;
};

/**
 * Return Environment Drive endpoint URL
 */
export const getEnvironmentDriverUrl = (): string | null => {
  const environmentDriverUrl = getWebConfig().externalEnvironmentDriverUrl;

  if (!environmentDriverUrl) {
    return null;
  }

  return environmentDriverUrl;
};

/**
 * Return Log Event Duration endpoint URL
 */
export const getLogEventDurationUrl = (): string | null => {
  const logEventDurationUrl = getWebConfig().externalLogEventDurationUrl;

  if (!logEventDurationUrl) {
    return null;
  }

  return logEventDurationUrl;
};

/**
 * Return Repository Driver endpoint URL
 */
export const getRepositoryDriverUrl = (): string | null => {
  const repositoryDriverUrl = getWebConfig().externalRepositoryDriverUrl;

  if (!repositoryDriverUrl) {
    return null;
  }

  return repositoryDriverUrl;
};

/**
 * Return Rex endpoint URL
 */
export const getRexUrl = (): string | null => {
  const rexUrl = getWebConfig().externalRexUrl;

  if (!rexUrl) {
    return null;
  }

  return rexUrl;
};

/**
 * Return ETT endpoint URL
 */
export const getEttUrl = (): string | null => {
  const ettUrl = getWebConfig().externalEttUrl;

  if (!ettUrl) {
    return null;
  }

  return ettUrl;
};

/**
 * Return Dingrogu endpoint URL
 */
export const getDingroguUrl = (): string | null => {
  const dingroguUrl = getWebConfig().externalDingroguUrl;

  if (!dingroguUrl) {
    return null;
  }

  return dingroguUrl;
};

/**
 * Return internal scm authority
 */
export const getInternalScmAuthority = (): string => {
  const internalScmAuthority = getWebConfig().internalScmAuthority;

  if (!internalScmAuthority) {
    throw new Error(`PNC internalScmAuthority does not contain any data: #${internalScmAuthority}#`);
  }

  return internalScmAuthority;
};
