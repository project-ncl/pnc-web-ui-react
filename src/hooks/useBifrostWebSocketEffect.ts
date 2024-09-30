import { useEffect } from 'react';

import { IUsePncWebSocketEffectOptions } from 'hooks/usePncWebSocketEffect';

import { uiLogger } from 'services/uiLogger';
import * as webConfigService from 'services/webConfigService';
import { createWebSocketClient } from 'services/webSocketClient';

const buildLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc._userlog_';
const buildLogMatchFiltersPrefix = 'mdc.processContext.keyword:build-';

const closeResultLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
const closeResultLogMatchFiltersPrefix = 'level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:';

const deliverablesAnalysisLogPrefixFilters = 'loggerName.keyword:org.jboss.pnc';
const deliverablesAnalysisLogMatchFiltersPrefix = 'level.keyword:DEBUG|INFO|ERROR|WARN,mdc.processContext.keyword:';

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
  deliverablesAnalysisId?: string;
}

const getPrefixFilters = ({
  buildId,
  closeResultId,
  deliverablesAnalysisId,
}: {
  buildId?: string;
  closeResultId?: string;
  deliverablesAnalysisId?: string;
}) => {
  if (buildId) return buildLogPrefixFilters;
  if (closeResultId) return closeResultLogPrefixFilters;
  if (deliverablesAnalysisId) return deliverablesAnalysisLogPrefixFilters;
  return '';
};

const getMatchFilters = ({
  buildId,
  closeResultId,
  deliverablesAnalysisId,
}: {
  buildId?: string;
  closeResultId?: string;
  deliverablesAnalysisId?: string;
}) => {
  if (buildId) return buildLogMatchFiltersPrefix + buildId;
  if (closeResultId) return closeResultLogMatchFiltersPrefix + closeResultId;
  if (deliverablesAnalysisId) return deliverablesAnalysisLogMatchFiltersPrefix + deliverablesAnalysisId;
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
  { preventListening = false, debug = '', buildId, closeResultId, deliverablesAnalysisId }: IUseBifrostWebSocketEffectOptions = {}
) => {
  useEffect(() => {
    if (preventListening) return;

    if (!buildId && !closeResultId && !deliverablesAnalysisId) {
      uiLogger.error('Missing ID of an entity of the log in the useBifrostWebSocketEffect');
      return;
    }

    const webSocketClient = createWebSocketClient(webConfigService.getBifrostWsUrl());

    const prefixFilters = getPrefixFilters({ buildId, closeResultId, deliverablesAnalysisId });
    const matchFilters = getMatchFilters({ buildId, closeResultId, deliverablesAnalysisId });

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

    webSocketClient.sendMessage(JSON.stringify(subscribeMessage));

    const onMessage = (wsMessage: MessageEvent) => {
      const wsResponseData: IWsResponseData = JSON.parse(wsMessage.data);
      const resultValue = wsResponseData.result?.value;
      resultValue?.message && callback(`[${resultValue.timestamp}] ${resultValue.message}`);
    };

    const removeMessageListener = webSocketClient.addMessageListener(onMessage, { debug });

    return () => {
      removeMessageListener();
      webSocketClient.close();
    };
  }, [callback, buildId, closeResultId, deliverablesAnalysisId, preventListening, debug]);
};
