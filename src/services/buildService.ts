import { AxiosRequestConfig } from 'axios';
import { kafkaClient } from './kafkaClient';

class BuildService {
  path = '/builds';

  /**
   * Gets Build Metrics by a list of build Ids.
   *
   * @returns BuildMetrics
   */
  public getBuildMetrics(buildIds: Array<string>, requestConfig: AxiosRequestConfig = {}) {
    return kafkaClient.getHttpClient().post(`${this.path}`, { buildIds }, requestConfig);
  }
}

/**
 * Instance of BuildService providing group of Build related API operations.
 */
export const buildService = new BuildService();
