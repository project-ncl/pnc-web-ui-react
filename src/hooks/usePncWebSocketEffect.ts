import { useEffect } from 'react';

import { pncWebSocketClient } from 'services/webSocketClient';

/**
 * HOOK
 */

interface IUsePncWebSocketEffectOptions {
  // condition based listening, when true, events will be ignored (for example when Build is finished)
  preventListening?: boolean;

  // debug identification string, NCL-8377
  debug?: string;
}

/**
 * WebSocket message listener hook.
 *
 * @param callback - Callback method, WebSocket parsed data attribute will be passed in
 * @param options - See {@link IUsePncWebSocketEffectOptions}
 */
export const usePncWebSocketEffect = (
  callback: (wsData: any) => void,
  { preventListening = false, debug = '' }: IUsePncWebSocketEffectOptions = {}
) => {
  useEffect(() => {
    if (!preventListening) {
      const onMessage = (wsMessage: MessageEvent) => {
        const wsData = JSON.parse(wsMessage.data);
        callback(wsData);
      };

      const removeMessageListener = pncWebSocketClient.addMessageListener(onMessage, { debug });

      return () => {
        removeMessageListener();
      };
    }
  }, [callback, preventListening, debug]);
};

/**
 * HOOK CHECKERS
 */

/**
 * Additional filtering parameters.
 */
interface IBuildParameters {
  buildConfigId?: string;
  userId?: string;
  productMilestoneId?: string;
}

/**
 * Check whether Build status change WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBuildParameters}
 * @returns true when Build status changed, otherwise false
 */
export const hasBuildStatusChanged = (
  wsData: any,
  { buildConfigId, userId, productMilestoneId }: IBuildParameters = {}
): boolean => {
  const result = wsData.job === 'BUILD' && wsData.notificationType === 'BUILD_STATUS_CHANGED';
  return (
    result &&
    (!buildConfigId || buildConfigId === wsData.build.buildConfigRevision.id) &&
    (!userId || userId === wsData.build.user.id) &&
    (!productMilestoneId || productMilestoneId === wsData.build.productMilestone.id)
  );
};

/**
 * Check whether new Build started WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBuildParameters}
 * @returns true when new Build was started, otherwise false
 */
export const hasBuildStarted = (wsData: any, { buildConfigId, userId }: IBuildParameters = {}): boolean =>
  hasBuildStatusChanged(wsData, { buildConfigId, userId }) && wsData.oldStatus === 'NEW';

/**
 * Additional filtering parameters.
 */
interface IGroupBuildParameters {
  groupConfigId?: string;
  userId?: string;
}

/**
 * Check whether Group Build status change WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IGroupBuildParameters}
 * @returns true when Group Build status changed, otherwise false
 */
export const hasGroupBuildStatusChanged = (wsData: any, { groupConfigId, userId }: IGroupBuildParameters = {}): boolean => {
  const result = wsData.job === 'GROUP_BUILD' && wsData.notificationType === 'GROUP_BUILD_STATUS_CHANGED';
  return (
    result &&
    (!groupConfigId || groupConfigId === wsData.groupBuild.groupConfig.id) &&
    (!userId || userId === wsData.groupBuild.user.id)
  );
};

/**
 * Check whether new Group Build started WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IGroupBuildParameters}
 * @returns true when new Group Build was started, otherwise false
 */
export const hasGroupBuildStarted = (wsData: any, { groupConfigId, userId }: IGroupBuildParameters = {}): boolean =>
  hasGroupBuildStatusChanged(wsData, { groupConfigId, userId }) && wsData.oldProgress === 'PENDING';
