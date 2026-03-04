import { IWebConfig } from 'services/webConfigService';

import webConfigDataMock from './web-config-data-mock.json';

export const getWebConfig = (): IWebConfig => webConfigDataMock;

export const getPncUrl = (): string => webConfigDataMock.externalPncUrl;

export const getPncNotificationsUrl = (): string => webConfigDataMock.pncNotificationsUrl;

export const getKafkaUrl = (): string => webConfigDataMock.kafkaUrl;

export const getUILoggerUrl = (): string => webConfigDataMock.uiLoggerUrl;

export const getBifrostWsUrl = (): string => webConfigDataMock.bifrostWsUrl;

export const getAuthConfigClientId = (): string => webConfigDataMock.keycloak.clientId;

export const getAuthConfigAuthority = (): string =>
  webConfigDataMock.keycloak.url + '/realms/' + webConfigDataMock.keycloak.realm;
