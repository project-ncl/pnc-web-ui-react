import { useEffect } from 'react';

import { IUsePncWebSocketEffectOptions } from 'hooks/usePncWebSocketEffect';

import { uiLogger } from 'services/uiLogger';
import * as webConfigService from 'services/webConfigService';
import { createWebSocketClient } from 'services/webSocketClient';

export const buildLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc._userlog_';
export const buildLogMatchFiltersPrefix = 'mdc.processContext.keyword:build-';

export const closeResultLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
export const closeResultLogMatchFiltersPrefix = 'level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:';

export const deliverablesAnalysisLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc';
export const deliverablesAnalysisLogMatchFiltersPrefix = 'level.keyword:DEBUG|INFO|ERROR|WARN,mdc.processContext.keyword:';

interface IMdc {
  requestContext: string;
  processContextVariant: string;
  level: string;
  processContext: string;
}

interface IValue {
  id: string;
  timestamp: string;
  sequence: string;
  loggerName: string;
  message: string;
  stackTrace: string | null;
  last: boolean;
  mdc: IMdc;
  subscriptionTopic: string;
}

interface IResult {
  type: string;
  value: IValue;
}

interface IWsResponseData {
  result: IResult;
  id: number;
  jsonrpc: string;
}

interface IUseBifrostWebSocketEffectOptions extends IUsePncWebSocketEffectOptions {
  filters: {
    prefixFilters: string;
    matchFilters: string;
  };
}

/**
 * WebSocket message listener hook.
 *
 * @param callback - Callback method, WebSocket parsed data attribute will be passed in
 * @param options - See {@link IUseBifrostWebSocketEffectOptions}
 */
export const useBifrostWebSocketEffect = (
  callback: (logLine: string) => void,
  { filters, preventListening = false, debug = '' }: IUseBifrostWebSocketEffectOptions
) => {
  useEffect(() => {
    if (preventListening) return;

    if (!filters || (!filters.prefixFilters && !filters.matchFilters)) {
      uiLogger.error('Missing filters in the useBifrostWebSocketEffect');
      return;
    }

    const bifrostWebSocketClient = createWebSocketClient(webConfigService.getBifrostWsUrl());

    const { prefixFilters, matchFilters } = filters;

    // Send subscribe message
    const subscribeMessage = {
      jsonrpc: '2.0',
      id: 0,
      method: 'SUBSCRIBE',
      params: {
        prefixFilters,
        matchFilters,
      },
    };

    bifrostWebSocketClient.sendMessage(JSON.stringify(subscribeMessage));

    const onMessage = (wsMessage: MessageEvent) => {
      const wsResponseData: IWsResponseData = JSON.parse(wsMessage.data);
      const resultValue = wsResponseData.result?.value;
      resultValue?.message && callback(`[${resultValue.timestamp}] ${resultValue.message}`);
    };

    const removeMessageListener = bifrostWebSocketClient.addMessageListener(onMessage, { debug });

    return () => {
      removeMessageListener();
      bifrostWebSocketClient.close();
    };
  }, [callback, filters, preventListening, debug]);
};
