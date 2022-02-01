import { IWebConfig } from './../WebConfigService';
import webConfigDataMock from './web-config-data-mock.json';

export const getWebConfig = (): IWebConfig => webConfigDataMock as IWebConfig;

export const getPncUrl = (): string => webConfigDataMock.externalPncUrl;
