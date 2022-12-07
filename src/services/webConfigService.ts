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
  externalDaUrl: string;
  externalCausewayUrl: string;
  externalIndyUrl: string;
  externalKafkaStoreUrl: string;
  externalPncUrl: string;
  externalRepourUrl: string;
  externalUiLoggerUrl: string;
  pncNotificationsUrl: string;
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
 * Return Kafka URL endpoint
 */
export const getKafkaUrl = (): string => {
  const kafkaUrl = getWebConfig().externalKafkaStoreUrl;

  if (!kafkaUrl) {
    throw new Error(`Kafka URL does not contain any data: #${kafkaUrl}#`);
  }
  return kafkaUrl;
};

export const getUILoggerUrl = (): string => {
  const uiLoggerUrl = getWebConfig().externalUiLoggerUrl;

  if (!uiLoggerUrl) {
    throw new Error(`UI Logger URL does not contain any data: #${uiLoggerUrl}#`);
  }

  return uiLoggerUrl;
};

export const getPncNotificationsUrl = (): string => {
  const pncNotificationsUrl = getWebConfig().pncNotificationsUrl;

  if (!pncNotificationsUrl) {
    throw new Error(`PNC notifications URL does not contain any data: #${pncNotificationsUrl}#`);
  }

  return pncNotificationsUrl;
};
