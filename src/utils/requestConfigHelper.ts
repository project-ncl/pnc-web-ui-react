import { AxiosRequestConfig } from 'axios';
import merge from 'lodash/merge';

import { IQParamOperators, addQParamItem } from 'utils/qParamHelper';

interface IQParam {
  id: string;
  value: string;
  operator: IQParamOperators;
}

interface IExtendParams {
  [key: string]: string | IQParam[] | undefined;
  qParams?: IQParam[];
}

/**
 * Function to extend request config with additional parameters.
 *
 * Q parameters being added are defined in qParams field of extendParams. Adding 'q' field directly is prohibited.
 *
 * @example
 * // requestConfig:
 * { params: { q: 'qa==text1;qb==text2', a: '100' } }
 *
 * @example
 * // extendParams:
 * { qParams: [ { id: 'qc', operator: '==', value: 'text3' } ], b: '200' }
 *
 * @example
 * // return data:
 * { params: { q: 'qa==text1;qb==text2;qc==text3', a: '100', b: '200' } }
 *
 * @param requestConfig - Original request cofig
 * @param extendParams - Parameters exteding request config
 * @returns extented request config
 */
export const extendRequestConfig = (requestConfig: AxiosRequestConfig, extendParams: IExtendParams): AxiosRequestConfig => {
  if ('q' in extendParams) {
    throw new Error('extendRequestConfig invalid params: q in extendParams');
  }

  const { qParams, ...extendParamsRest } = extendParams;
  const newRequestConfig: AxiosRequestConfig = merge({}, requestConfig, { params: extendParamsRest });
  newRequestConfig.params.q = requestConfig?.params?.q ? requestConfig.params.q : '';

  extendParams.qParams?.forEach((qParam) => {
    const newQParam = addQParamItem(qParam.id, qParam.value, qParam.operator, newRequestConfig.params.q);
    if (newQParam) {
      newRequestConfig.params.q = newQParam;
    }
  });

  return newRequestConfig;
};
