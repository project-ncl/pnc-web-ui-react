import { AxiosRequestConfig } from 'axios';

import { IUILog } from 'services/uiLogger';
import { uiLoggerClient } from 'services/uiLoggerClient';

/**
 * Creates new UI log.
 *
 * @param data - JSON object containing log data
 * @param requestConfig  - Axios based request config
 */
export const createUILog = (data: IUILog, requestConfig: AxiosRequestConfig = {}) => {
  return uiLoggerClient.getHttpClient().post<undefined>('/rest/logs', data, requestConfig);
};
