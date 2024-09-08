import { useEffect } from 'react';

import { bifrostWSClient } from 'services/webSocketClient';

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

interface IUseBifrostWebSocketEffectOptions {
  buildId?: string;

  // condition based listening, when true, events will be ignored (for example when Build is finished)
  preventListening?: boolean;

  // debug identification string
  debug?: string;
}

/**
 * WebSocket message listener hook.
 *
 * @param callback - Callback method, WebSocket parsed data attribute will be passed in
 * @param options - See {@link IUseBifrostWebSocketEffectOptions}
 */
export const useBifrostWebSocketEffect = (
  callback: (wsData: any) => void,
  { preventListening = false, debug = '', buildId = '' }: IUseBifrostWebSocketEffectOptions = {}
) => {
  useEffect(() => {
    if (!preventListening) {
      // Send subscribe message for build
      const subscribeMessage = {
        jsonrpc: '2.0',
        id: 0,
        method: 'SUBSCRIBE',
        params: {
          prefixFilters: 'loggerName.keyword:org.jboss.pnc._userlog_',
          matchFilters: 'mdc.processContext.keyword:build-' + buildId,
        },
      };

      bifrostWSClient.sendMessage(JSON.stringify(subscribeMessage));

      const onMessage = (wsMessage: MessageEvent) => {
        const wsResponseData: IWsResponseData = JSON.parse(wsMessage.data);
        const resultValue = wsResponseData.result?.value;
        resultValue?.message && callback(`[${resultValue.timestamp}] ${resultValue.message}`);
      };

      const removeMessageListener = bifrostWSClient.addMessageListener(onMessage, { debug });

      return () => {
        removeMessageListener();
      };
    }
  }, [callback, preventListening, debug]);
};
