import webConfigDataMock from './web-config-data-mock.json';

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

export const getWebConfig = (): IWebConfig => {
  const webConfig = webConfigDataMock as IWebConfig;

  if (!webConfig) {
    throw new Error(
      `Web Config does not contain any data, check whether internal network resources are reachable: #${webConfig}#`
    );
  }

  return webConfig;
};

export const getPncUrl = (): string => {
  const pncUrl = getWebConfig().config?.externalPncUrl;

  if (!pncUrl) {
    throw new Error(`PNC URL does not contain any data: #${pncUrl}#`);
  }
  return pncUrl;
};
