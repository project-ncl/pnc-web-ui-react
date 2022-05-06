import { IWebConfig } from './../WebConfigService';
import webConfigDataMock from './web-config-data-mock.json';

export const getWebConfig = (): IWebConfig => webConfigDataMock;

export const getPncUrl = (): string => webConfigDataMock.externalPncUrl;

export const getKafkaUrl = (): string => webConfigDataMock.kafkaUrl;
