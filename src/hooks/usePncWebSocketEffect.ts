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
interface IScmRepositoryParameters {
  taskId?: string;
}

/**
 * Check whether Scm Repository failed WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IScmRepositoryParameters}
 * @returns true when Scm Repository failed, otherwise false
 */
export const hasScmRepositoryFailed = (wsData: any, { taskId }: IScmRepositoryParameters): boolean => {
  if (wsData.job !== 'SCM_REPOSITORY_CREATION' || !wsData.notificationType.includes('ERROR')) {
    return false;
  }

  return !taskId || taskId === wsData.taskId;
};

/**
 * Check whether Scm Repository success WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IScmRepositoryParameters}
 * @returns true when Scm Repository succeeded, otherwise false
 */
export const hasScmRepositorySucceeded = (wsData: any, { taskId }: IScmRepositoryParameters): boolean => {
  if (
    wsData.job !== 'SCM_REPOSITORY_CREATION' ||
    wsData.notificationType !== 'SCMR_CREATION_SUCCESS' ||
    wsData.progress !== 'FINISHED'
  ) {
    return false;
  }

  if (!wsData.scmRepository) {
    uiLogger.error('scmRepository: invalid WebSocket message ("scmRepository" parameter is missing)', undefined, wsData);
    return false; // ignore changes when 'scmRepository' is not available
  }

  return !taskId || taskId === wsData.taskId;
};

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
export const hasBuildStarted = (wsData: any, parameters: IBuildParameters = {}): boolean =>
  hasBuildStatusChanged(wsData, parameters) && wsData.oldStatus === 'NEW';

/**
 * Check whether Build finished WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @param parameters - See {@link IBuildParameters}
 * @returns true when Build was finished, otherwise false
 */
export const hasBuildFinished = (wsData: any, parameters: IBuildParameters = {}): boolean =>
  hasBuildStatusChanged(wsData, parameters) && wsData.progress === 'FINISHED';

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
export const hasGroupBuildStarted = (wsData: any, parameters: IGroupBuildParameters = {}): boolean =>
  hasGroupBuildStatusChanged(wsData, parameters) && wsData.oldProgress === 'PENDING';

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

/**
 * Additional filtering parameters.
 */
interface IMilestoneCloseParameters {
  closeResultId?: string;
  productMilestoneId?: string;
}

/**
 * Check whether Milestone Close (Milestone Push) finished WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @returns true when Milestone Close finished, otherwise false
 */
export const hasMilestoneCloseFinished = (
  wsData: any,
  { closeResultId, productMilestoneId }: IMilestoneCloseParameters = {}
): boolean => {
  if (
    wsData.job !== 'PRODUCT_MILESTONE_CLOSE' ||
    wsData.notificationType !== 'PRODUCT_MILESTONE_CLOSE_RESULT' ||
    wsData.progress !== 'FINISHED'
  ) {
    return false;
  }

  if (!wsData.productMilestoneCloseResult) {
    uiLogger.error(
      'hasMilestonePushFinished: invalid WebSocket message ("productMilestoneCloseResult" parameter is missing)',
      undefined,
      wsData
    );
    return false; // ignore changes when 'productMilestoneCloseResult' is not available
  }

  return (
    (!closeResultId || closeResultId === wsData.productMilestoneCloseResult.id) &&
    (!productMilestoneId || productMilestoneId === wsData.productMilestoneCloseResult.milestone?.id)
  );
};

interface IDeliverablesAnalysisParameters {
  operationId?: string;
}

/**
 * Check whether Deliverables Analysis changed WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @returns true when Deliverables Analysis changed, otherwise false
 */
export const hasDeliverablesAnalysisChanged = (wsData: any, { operationId }: IDeliverablesAnalysisParameters = {}): boolean => {
  return (
    wsData.job === 'OPERATION' &&
    wsData.notificationType === 'DELIVERABLES_ANALYSIS' &&
    (!operationId || operationId === wsData.operationId)
  );
};

/**
 * Check whether Deliverables Analysis finished WebSocket event was sent.
 *
 * @param wsData - WebSocket data
 * @returns true when Deliverables Analysis finished, otherwise false
 */
export const hasDeliverablesAnalysisFinished = (wsData: any, parameters: IDeliverablesAnalysisParameters = {}): boolean =>
  hasDeliverablesAnalysisChanged(wsData, parameters) && wsData.progress === 'FINISHED';
