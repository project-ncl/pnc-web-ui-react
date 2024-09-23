import { useEffect } from 'react';

import { IUsePncWebSocketEffectOptions } from 'hooks/usePncWebSocketEffect';

import { uiLogger } from 'services/uiLogger';
import { bifrostWebSocketClient } from 'services/webSocketClient';

const buildLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc._userlog_';
const buildLogMatchFiltersPrefix = 'mdc.processContext.keyword:build-';

const closeResultLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
const closeResultLogMatchFiltersPrefix = 'level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:';

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
  buildId?: string;
  closeResultId?: string;
}

const getPrefixFilters = ({ buildId, closeResultId }: { buildId?: string; closeResultId?: string }) => {
  if (buildId) return buildLogPrefixFilters;
  if (closeResultId) return closeResultLogPrefixFilters;
  return '';
};

const getMatchFilters = ({ buildId, closeResultId }: { buildId?: string; closeResultId?: string }) => {
  if (buildId) return buildLogMatchFiltersPrefix + buildId;
  if (closeResultId) return closeResultLogMatchFiltersPrefix + closeResultId;
  return '';
};

/**
 * WebSocket message listener hook.
 *
 * @param callback - Callback method, WebSocket parsed data attribute will be passed in
 * @param options - See {@link IUseBifrostWebSocketEffectOptions}
 */
export const useBifrostWebSocketEffect = (
  callback: (logLine: string) => void,
  { preventListening = false, debug = '', buildId, closeResultId }: IUseBifrostWebSocketEffectOptions = {}
) => {
  useEffect(() => {
    if (preventListening) return;

    if (!buildId && !closeResultId) {
      uiLogger.error('Missing ID of an entity of the log in the useBifrostWebSocketEffect');
      return;
    }

    const prefixFilters = getPrefixFilters({ buildId, closeResultId });
    const matchFilters = getMatchFilters({ buildId, closeResultId });
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
    };
  }, [callback, buildId, closeResultId, preventListening, debug]);
};
