import { AxiosRequestConfig } from 'axios';

import { uiLogger } from 'services/uiLogger';

import { addQParamItem } from 'utils/qParamHelper';

interface IExtendedParams {
  [key: string]: string | number;
}

/**
 * Extends request configs 'params' property. See example section.
 *
 * @example
 * ```tsx
 * // ORIGINAL PARAMS
 * {
 *   "sort": "=asc=name",
 *   "pageIndex": 1,
 *   "pageSize": 10,
 *   "conflictKey": "valueA",
 *   "q": "user.id==100"
 * }
 *
 * // NEW PARAMS
 * {
 *   // protected params, they will be ignored
 *   "sort": "valueB",
 *   "pageIndex": 5,
 *   "pageSize": 5,
 *
 *   // protected param, it will be ignored, use 'newParams.qItems' instead to extend original 'q' param
 *   "q": 5,
 *
 *   // 'qItems' is processed specifically, original 'q' param will be extended instead, original 'qItems' params won't be modified
 *   "qItems": [{
 *     id: "project.id", value: id, operator: "=="
 *   }, {
 *     id: "buildType", value: "MVN", operator: "=="
 *   }],
 *
 *   // other params
 *   "newKey": "valueB",      // when only newParams (not originalParams) contain 'newKey', it will be added
 *   "conflictKey": "valueB"  // when both originalParams and newParams contain 'conflictKey', original param value one will be used
 * }
 *
 * // EXTENDED PARAMS
 * {
 *   "sort": "=asc=name",
 *   "pageIndex": 1,
 *   "pageSize": 10,
 *   "conflictKey": "valueA"
 *   "q": "user.id==100;project.id==100;buildType==MVN"
 *   "newKey": "valueB"
 * }
 * ```
 *
 * @param originalParams - read only original params
 * @param newParams - read only new params containing list of additional params
 * @returns New object containing extended request config params
 */
const extendParams = (originalParams: any, newParams: any): IExtendedParams => {
  /**
   * Return new params directly when original params are empty
   */
  if (!originalParams || Object.keys(originalParams).length === 0) {
    return newParams;
  }

  /**
   * Create deep copy based on the originalParams and apply new params one be one coming from newParams
   */
  const extendedParams: IExtendedParams = JSON.parse(JSON.stringify(originalParams));
  Object.keys(newParams).forEach((newParamKey: string) => {
    /*
     * Not recommended param [ignoring new param]
     */
    if (['params'].includes(newParamKey)) {
      uiLogger.error(
        `New param (${newParamKey} = ${newParams[newParamKey]}) is ignored. Using '${newParamKey}' as params property is disabled because it's probably a mistake, if it's not mistake, then enable it.`
      );
    } else if (['q', 'pageSize', 'pageIndex', 'sort'].includes(newParamKey)) {
      /*
       * Protected param [ignoring new param]
       */
      uiLogger.error(
        `New param (${newParamKey} = ${newParams[newParamKey]}) is ignored. Don't extend protected request config param '${newParamKey}'.`
      );
    } else if (newParamKey === 'qItems') {
      if (extendedParams[newParamKey]) {
        uiLogger.error(
          `Original params already contain '${newParamKey}' param (it can be probably mistake), but '${newParamKey}' won't be extended, 'q' param will be extended instead.`
        );
      }
      /*
       * 'q' param [extending original value]
       */
      let q: string = extendedParams.q ? (extendedParams.q as string) : '';
      newParams.qItems.forEach((qItem: any) => {
        const newQ = addQParamItem(qItem.id, qItem.value, qItem.operator, q, false);
        if (newQ) {
          q = newQ;
        } else {
          uiLogger.error(`New Q param (${qItem.id} = ${qItem.value}) is ignored. Original Q params already contains given key.`);
        }
      });
      extendedParams.q = q;
    } else if (!extendedParams[newParamKey]) {
      /*
       * New param [adding new param] - this param does not exist yet
       */
      extendedParams[newParamKey] = newParams[newParamKey];
    } else if (extendedParams[newParamKey]) {
      /*
       * Conflict param [keeping original value]
       */
      uiLogger.error(
        `New param (${newParamKey} = ${newParams[newParamKey]}) is ignored. Param (${newParamKey} = ${extendedParams[newParamKey]}) already exists. Merging rules have to be defined first, see for example 'qItems'.`
      );
    } else {
      /*
       * Unrecognized param - invalid state which should not happen
       */
      uiLogger.error(`Unrecognized param - invalid state which should not happen`);
    }
  });

  return extendedParams;
};

interface IExtendRequestConfig {
  originalConfig: AxiosRequestConfig;
  newParams: any;
}

/**
 * Safely extend request config with additional properties, extending following properties is supported at this moment:
 *  - 'params' via newParams
 *
 * @param Object containing:
 *  - originalConfig - original request config, extended config will be based on it
 *  - newParams - see {@link extendParams} documentation
 * @returns Extended request config
 */
export const extendRequestConfig = ({ originalConfig, newParams }: IExtendRequestConfig): AxiosRequestConfig => {
  const extendedConfig: AxiosRequestConfig = {
    ...originalConfig,

    // extend params properties
    params: extendParams(originalConfig.params, newParams),
  };
  return extendedConfig;
};
