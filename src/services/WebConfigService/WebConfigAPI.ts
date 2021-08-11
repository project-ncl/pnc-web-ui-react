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

export class WebConfigAPI {
  /**
   * Return PNC Web Configuration data coming from Orchestrator
   *
   * @returns PNC Web Configuration data
   */
  public static getWebConfig(): IWebConfig {
    // window.pnc object is loaded in public/index.html from Orchestrator
    const pncWebConfigLoadedFromOrch = window.pnc;

    if (!pncWebConfigLoadedFromOrch) {
      throw new Error(`Web Config does not contain any data: #${pncWebConfigLoadedFromOrch}#`);
    }
    return pncWebConfigLoadedFromOrch;
  }
}
