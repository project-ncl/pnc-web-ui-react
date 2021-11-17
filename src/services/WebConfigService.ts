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

export interface IWebConfigData {
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
  pncNotificationsUrl: string;
  userGuideUrl: string;
  ssoTokenLifespan: number;
  keycloak: IWebConfigKeycloak;
  grafana: IWebConfigGrafana;
  internalScmAuthority: string;
}

export interface IWebConfig {
  config: IWebConfigData | null;
}

/**
 * Return PNC Web Configuration data coming from Orchestrator
 */
export const getWebConfig = (): IWebConfig => {
  // window.pnc object is loaded in public/index.html from Orchestrator
  const webConfig = window.pnc;

  if (!webConfig) {
    throw new Error(
      `Web Config does not contain any data, check whether internal network resources are reachable: #${webConfig}#`
    );
  }

  return webConfig;
};

/**
 * Return PNC URL endpoint
 */
export const getPncUrl = (): string => {
  const pncUrl = getWebConfig().config?.externalPncUrl;

  if (!pncUrl) {
    throw new Error(`PNC URL does not contain any data: #${pncUrl}#`);
  }
  return pncUrl;
};
