import { useEffect } from 'react';

import { IUsePncWebSocketEffectOptions } from 'hooks/usePncWebSocketEffect';

import { uiLogger } from 'services/uiLogger';
import * as webConfigService from 'services/webConfigService';
import { createWebSocketClient } from 'services/webSocketClient';

export const buildLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc._userlog_';
export const buildLogMatchFiltersPrefix = 'mdc.processContext.keyword:build-';

export const closeResultLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
export const closeResultLogMatchFiltersPrefix = 'level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:';

export const deliverableAnalysisLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc';
export const deliverableAnalysisLogMatchFiltersPrefix = 'level.keyword:DEBUG|INFO|ERROR|WARN,mdc.processContext.keyword:';

export const brewPushLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
export const brewPushLogMatchFiltersPrefix1 = 'level.keyword:INFO|ERROR|WARN,mdc.buildId.keyword:';
export const brewPushLogMatchFiltersPrefix2 = ',mdc.processContext.keyword:';

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
  onCleanup?: () => void;
}

/**
 * WebSocket message listener hook.
 *
 * @param callback - Callback method, WebSocket parsed data attribute will be passed in
 * @param options - See {@link IUseBifrostWebSocketEffectOptions}
 *  - filters - Filtering criteria for the WebSocket messages
 *      - prefixFilters: The prefixFilters for the WebSocket message
 *      - matchFilters: The matchFilters for the WebSocket message
 *  - onCleanup - Optional cleanup function to execute when the WebSocket connection is closed or the hook is unmounted
 */
export const useBifrostWebSocketEffect = (
  callback: (logLines: string[]) => void,
  { filters, preventListening = false, debug = '', onCleanup }: IUseBifrostWebSocketEffectOptions
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
        batchDelay: 500,
        batchSize: 1000,
      },
    };

    bifrostWebSocketClient.sendMessage(JSON.stringify(subscribeMessage));

    const onMessage = (wsMessage: MessageEvent) => {
      const wsResponseData: IWsResponseData = JSON.parse(wsMessage.data);
      const resultValue = wsResponseData.result?.value;
      const messages =
        resultValue?.message
          ?.replace(/\n$/, '')
          .split(/[\r\n]/)
          .map((message, index) => (index === 0 ? `[${resultValue.timestamp}] ${message}` : message)) || [];
      messages.length && callback(messages);
    };

    const removeMessageListener = bifrostWebSocketClient.addMessageListener(onMessage, { debug });

    return () => {
      removeMessageListener();
      bifrostWebSocketClient.close();
      if (onCleanup) {
        onCleanup();
      }
    };
  }, [callback, filters, preventListening, debug, onCleanup]);
};
