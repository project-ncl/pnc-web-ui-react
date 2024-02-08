import { useEffect } from 'react';

import { uiLogger } from 'services/uiLogger';
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
  buildId?: string;
  groupBuildId?: string;
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
  { buildConfigId, userId, productMilestoneId, buildId, groupBuildId }: IBuildParameters = {}
): boolean => {
  if (wsData.job !== 'BUILD' || wsData.notificationType !== 'BUILD_STATUS_CHANGED') {
    return false;
  }

  if (!wsData.build) {
    uiLogger.error('hasBuildStatusChanged: invalid WebSocket message ("build" parameter is missing)', undefined, wsData);
    return false; // ignore changes when 'build' is not available
  }

  if (groupBuildId && !wsData.build?.groupBuild) {
    uiLogger.log(
      'hasBuildStatusChanged: invalid WebSocket message ("build.groupBuild" parameter is missing), known backend issue: NCL-8394',
      undefined,
      wsData
    );
    return true; // force new changes until NCL-8394 is solved
  }

  return (
    (!buildConfigId || buildConfigId === wsData.build?.buildConfigRevision?.id) &&
    (!userId || userId === wsData.build?.user?.id) &&
    (!productMilestoneId || productMilestoneId === wsData.build?.productMilestone?.id) &&
    (!buildId || buildId === wsData.build?.id) &&
    (!groupBuildId || groupBuildId === wsData.build?.groupBuild?.id)
  );
};

/**
 * Check whether new Build started WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBuildParameters}
 * @returns true when new Build was started, otherwise false
 */
export const hasBuildStarted = (
  wsData: any,
  { buildConfigId, userId, productMilestoneId, buildId, groupBuildId }: IBuildParameters = {}
): boolean =>
  hasBuildStatusChanged(wsData, { buildConfigId, userId, productMilestoneId, buildId, groupBuildId }) &&
  wsData.oldStatus === 'NEW';

/**
 * Check whether Build finished WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBuildParameters}
 * @returns true when Build was finished, otherwise false
 */
export const hasBuildFinished = (
  wsData: any,
  { buildConfigId, userId, productMilestoneId, buildId, groupBuildId }: IBuildParameters = {}
): boolean =>
  hasBuildStatusChanged(wsData, { buildConfigId, userId, productMilestoneId, buildId, groupBuildId }) &&
  wsData.progress === 'FINISHED';

/**
 * Additional filtering parameters.
 */
interface IGroupBuildParameters {
  groupConfigId?: string;
  userId?: string;
  groupBuildId?: string;
}

/**
 * Check whether Group Build status change WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IGroupBuildParameters}
 * @returns true when Group Build status changed, otherwise false
 */
export const hasGroupBuildStatusChanged = (
  wsData: any,
  { groupConfigId, userId, groupBuildId }: IGroupBuildParameters = {}
): boolean => {
  if (wsData.job !== 'GROUP_BUILD' || wsData.notificationType !== 'GROUP_BUILD_STATUS_CHANGED') {
    return false;
  }

  if (!wsData.groupBuild) {
    uiLogger.error(
      'hasGroupBuildStatusChanged: invalid WebSocket message ("groupBuild" parameter is missing)',
      undefined,
      wsData
    );
    return false; // ignore changes when 'groupBuild' is not available
  }

  return (
    (!groupConfigId || groupConfigId === wsData.groupBuild?.groupConfig?.id) &&
    (!userId || userId === wsData.groupBuild?.user?.id) &&
    (!groupBuildId || groupBuildId === wsData.groupBuild?.id)
  );
};

/**
 * Check whether new Group Build started WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IGroupBuildParameters}
 * @returns true when new Group Build was started, otherwise false
 */
export const hasGroupBuildStarted = (wsData: any, { groupConfigId, userId, groupBuildId }: IGroupBuildParameters = {}): boolean =>
  hasGroupBuildStatusChanged(wsData, { groupConfigId, userId, groupBuildId }) && wsData.oldProgress === 'PENDING';

/**
 * Additional filtering parameters.
 */
interface IBrewPushParameters {
  buildId?: string;
}

/**
 * Check whether Brew Push finished WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBrewPushParameters}
 * @returns true when Brew Push finished, otherwise false
 */
export const hasBrewPushFinished = (wsData: any, { buildId }: IBrewPushParameters = {}): boolean => {
  if (wsData.job !== 'BREW_PUSH' || wsData.notificationType !== 'BREW_PUSH_RESULT') {
    return false;
  }

  if (!wsData.buildPushResult) {
    uiLogger.error('hasBrewPushFinished: invalid WebSocket message ("buildPushResult" parameter is missing)', undefined, wsData);
    return false; // ignore changes when 'buildPushResult' is not available
  }

  return !buildId || buildId === wsData.buildPushResult?.buildId;
};
